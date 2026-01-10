import { defineTable } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

import { getPlanConfig } from "./planLimitConfig";

export const forms = defineTable({
  name: v.string(),
  createdBy: v.id("users"),

  // Flexible properties system
  properties: v.object({
    description: v.optional(v.string()),
    title: v.optional(v.string()),
    contactInfo: v.optional(
      v.object({
        type: v.optional(v.string()), // "email" | "phone" | "website"
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        profile: v.optional(v.string()),
        website: v.optional(v.string()),
        calendarLink: v.optional(v.string()),
      }),
    ),
    socialLinks: v.optional(v.any()),
    tags: v.optional(v.array(v.string())),
  }),

  // Services array
  services: v.array(
    v.object({
      id: v.string(),
      title: v.string(),
    }),
  ),

  // Flexible workflows - using v.any() for future-proof step structure
  workflows: v.any(),
}).index("createdBy", ["createdBy"]);

export const get = query({
  args: {
    formId: v.id("forms"),
  },
  handler: (ctx, args) => {
    return ctx.db.get(args.formId);
  },
});

export const update = mutation({
  args: {
    id: v.id("forms"),
    name: v.string(),
    properties: v.any(),
    services: v.any(),
    workflows: v.any(),
  },
  handler: async (ctx, args) => {
    // 1. Get the organization that owns this form
    // Note: This query might be slow if there are many organizations. 
    // Ideally we should have an index on formId or pass orgId.
    // For now, consistent with schema.
    const org = await ctx.db
      .query("organisations")
      .filter((q) => q.eq(q.field("formId"), args.id))
      .first();

    if (org) {
      const planConfig = getPlanConfig(org.plan);
      const limit = planConfig.limits.servicesLimit;

      // Check services limit (if services are being updated)
      if (args.services && Array.isArray(args.services)) {
        if (args.services.length > limit) {
          throw new Error(
            `You have reached the limit of ${limit} services for your ${planConfig.name} plan. Please upgrade to add more.`
          );
        }
      }
    }

    return ctx.db.patch(args.id, {
      name: args.name,
      properties: args.properties,
      services: args.services,
      workflows: args.workflows,
    });
  },
});

export const getFormByOrganisationId = query({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.organisationId);

    if (!org) return null;

    const form = await ctx.db.get(org.formId);

    if (!form) return null;

    return form;
  },
});
export const getFormWithOrganisationByHandle = query({
  args: {
    handle: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organisations")
      .withIndex("handle", (q) => q.eq("handle", args.handle))
      .first();

    if (!org) return null;

    const form = await ctx.db.get(org.formId);

    if (!form) return null;

    // Check submission limit
    const planConfig = getPlanConfig(org.plan);
    const limit = planConfig.limits.submissionsPerMonth;
    let limitReached = false;

    if (limit !== Infinity) {
      const now = Date.now();
      const monthStart = new Date(now);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthStartTs = monthStart.getTime();

      const currentSubmissionsCount = (await ctx.db
        .query("submissions")
        .withIndex("organisation", (q) => q.eq("organisation", org._id))
        .filter((q) => q.gte(q.field("_creationTime"), monthStartTs))
        .collect()).length;

      if (currentSubmissionsCount >= limit) {
        limitReached = true;
      }
    }

    return {
      form,
      organisation: {
        ...org,
        image: org.image ? await ctx.storage.getUrl(org.image) : undefined,
      },
      limitReached,
    };
  },
});
