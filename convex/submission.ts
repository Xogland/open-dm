import { defineTable } from "convex/server";
import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

import { getPlanConfig } from "./planLimitConfig";
import { getUsageWindow } from "./subscriptions";

export const submissions = defineTable({
  form: v.id("forms"),
  organisation: v.id("organisations"),

  // New fields for chat-based workflow submissions
  service: v.string(), // Selected service
  workflowAnswers: v.any(), // Flexible storage for all workflow answers

  // Legacy/compatibility fields
  email: v.string(),
  cc: v.optional(v.array(v.string())),
  content: v.optional(v.string()),

  // Metadata
  timeToSubmit: v.optional(v.number()),
  score: v.optional(v.number()),
  accessControl: v.union(
    v.object({
      type: v.literal("organisation"),
    }),
    v.object({
      type: v.literal("users"),
      users: v.array(v.string()),
    }),
  ),
  statusId: v.optional(v.string()),
  sesMessageId: v.optional(v.string()),
  stripePaymentId: v.optional(v.string()),
})
  .index("organisation", ["organisation"])
  .index("form", ["form"])
  .index("service", ["service"])
  .searchIndex("byAccessUser", {
    searchField: "accessControl.users",
    filterFields: ["accessControl.users"],
  });

export const createSubmission = mutation({
  args: {
    formId: v.id("forms"),
    organisation: v.id("organisations"),
    service: v.string(),
    workflowAnswers: v.any(),
    email: v.string(),
    cc: v.optional(v.array(v.string())),
    content: v.optional(v.string()),
    timeToSubmit: v.optional(v.number()),
    score: v.optional(v.number()),
    accessControl: v.union(
      v.object({
        type: v.literal("organisation"),
      }),
      v.object({
        type: v.literal("users"),
        users: v.array(v.string()),
      }),
    ),
    stripePaymentId: v.optional(v.string()),
  },
  handler: async (
    ctx,
    {
      formId,
      organisation,
      service,
      workflowAnswers,
      cc,
      content,
      email,
      score,
      timeToSubmit,
      accessControl,
      stripePaymentId,
    },
  ) => {
    const org = await ctx.db.get(organisation);
    if (!org) throw new Error("Organisation not found");

    // Check submission limits
    const planConfig = getPlanConfig(org.plan);
    const limit = planConfig.limits.submissionsPerMonth;

    if (limit !== Infinity) {
      const { windowStart } = await getUsageWindow(ctx, organisation);

      // Count submissions for this period
      // Note: This scans all organization submissions. For high Scale, add index on [organisation, _creationTime]
      const currentSubmissionsCount = (await ctx.db
        .query("submissions")
        .withIndex("organisation", (q) => q.eq("organisation", organisation))
        .filter((q) => q.gte(q.field("_creationTime"), windowStart))
        .collect()).length;

      if (currentSubmissionsCount >= limit) {
        throw new Error(
          `You have reached the limit of ${limit} submissions/month for your ${planConfig.name} plan. Please upgrade to receive more.`
        );
      }
    }

    let statusId = undefined;
    if (org?.statuses && org.statuses.length > 0) {
      const defaultStatus = org.statuses.find((s) => s.isDefault) || org.statuses[0];
      statusId = defaultStatus.id;
    }

    const id = await ctx.db.insert("submissions", {
      form: formId,
      organisation,
      service,
      workflowAnswers,
      email,
      cc,
      content,
      score,
      timeToSubmit,
      accessControl,
      statusId,
      stripePaymentId,
    });

    // Handle Email Escalation
    const members = await ctx.db
      .query("organisationMembers")
      .withIndex("by_organisation_id", (q) => q.eq("organisationId", organisation))
      .collect();

    const escalationEmails: string[] = [];
    for (const member of members) {
      const config = member.serviceEscalation?.[service];
      if (config?.enabled) {
        const user = await ctx.db.get(member.userId);
        if (user) {
          const targetEmail = user.email;
          if (targetEmail) {
            escalationEmails.push(targetEmail);
          }
        }
      }
    }

    // Trigger email sending to escalationEmails
    if (escalationEmails.length > 0) {
      await ctx.scheduler.runAfter(0, internal.emails.sendEscalation, {
        emails: escalationEmails,
        submissionId: id,
        orgName: org.name,
        service: service,
        workflowAnswers,
        content,
        senderEmail: email,
      });
    }

    if (email && email.trim().length > 0) {
      const connection = await ctx.db
        .query("connections")
        .filter((q) =>
          q.and(
            q.eq(q.field("organisation"), organisation),
            q.eq(q.field("email"), email),
          ),
        )
        .first();

      if (!connection) {
        await ctx.db.insert("connections", {
          email,
          service,
          organisation,
          status: "Active",
          lastSubmission: id,
          submissionCount: 1,
        });
      } else {
        await ctx.db.patch(connection._id, {
          service: service,
          lastSubmission: id,
          submissionCount: (connection.submissionCount ?? 0) + 1,
        });
      }
    }


    return id;
  },
});

export const getSubmissions = query({
  args: {
    organisation: v.id("organisations"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.userEmail))
      .first();

    if (!userId) return [];

    const org = await ctx.db.get(args.organisation);
    if (!org) return [];

    // Check user's role and access
    const isOwner = org.owner === userId._id;
    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId._id).eq("organisationId", args.organisation)
      )
      .first();

    if (!membership && !isOwner) return [];

    const userRole = isOwner ? "owner" : (membership?.role ?? null);
    const allowedServices = membership?.allowedServices;

    // If subscription is expired and not owner, deny access
    if (!isOwner && (org.subscriptionStatus !== "active" || membership?.status !== "active")) {
      return [];
    }

    if (!userRole) return [];

    // Get submissions based on access control
    const orgSubmissions = await ctx.db
      .query("submissions")
      .withIndex("organisation", (q) => q.eq("organisation", args.organisation))
      .filter((q) => q.eq(q.field("accessControl.type"), "organisation"))
      .collect();

    const userSubmissions = await ctx.db
      .query("submissions")
      .withSearchIndex("byAccessUser", (q) =>
        q.search("accessControl.users", args.userEmail)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("organisation"), args.organisation),
          q.eq(q.field("accessControl.type"), "users")
        )
      )
      .collect();

    const combinedSubmissionsMap = new Map();
    [...orgSubmissions, ...userSubmissions].forEach((submission) => {
      combinedSubmissionsMap.set(submission._id, submission);
    });

    let submissions = Array.from(combinedSubmissionsMap.values());
    submissions.sort((a, b) => b._creationTime - a._creationTime);

    // Filter by allowed services for restricted users
    if (allowedServices !== undefined) {
      submissions = submissions.filter((s) =>
        allowedServices!.includes(s.service)
      );
    }

    const forms = await Promise.all(
      submissions.map(async (submission) => {
        return await ctx.db.get(submission.form as Id<"forms">);
      })
    );

    return submissions.map((submission, i) => ({
      ...submission,
      formName: forms[i]?.name ?? "",
    }));
  },
});

export const getSubmission = query({
  args: {
    id: v.id("submissions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const submission = await ctx.db.get(args.id);
    if (!submission) return null;

    const organisation = await ctx.db.get(submission.organisation);
    if (!organisation) return null;

    // Check if user is owner or member
    const isOwner = organisation.owner === userId;
    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", submission.organisation)
      )
      .first();

    if (!isOwner && !membership) return null;

    // Check service access
    if (membership?.allowedServices !== undefined) {
      if (!membership.allowedServices.includes(submission.service)) {
        return null;
      }
    }

    const form = await ctx.db.get(submission.form);

    return {
      ...submission,
      formName: form?.name ?? "",
    };
  },
});

export const updateSubmissionStatus = mutation({
  args: {
    id: v.id("submissions"),
    statusId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const submission = await ctx.db.get(args.id);
    if (!submission) throw new Error("Submission not found");

    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", submission.organisation)
      )
      .first();

    const org = await ctx.db.get(submission.organisation);
    if (org?.owner !== userId && !membership) {
      throw new Error("You don't have access to this organisation");
    }

    await ctx.db.patch(args.id, {
      statusId: args.statusId,
    });
  },
});

export const updateSubmissionSesId = internalMutation({
  args: {
    id: v.id("submissions"),
    sesMessageId: v.string(),
  },
  handler: async (ctx, args) => {
    // Note: This is an internal-use mutation, but since it's an exported mutation
    // we should ideally restrict it or rely on the fact that only the backend calls it.
    // In Convex, internal functions are safer for this, but actions trigger via internal.
    await ctx.db.patch(args.id, {
      sesMessageId: args.sesMessageId,
    });
  },
});
