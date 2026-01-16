import { defineTable } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

import { getPlanConfig } from "./planLimitConfig";

export const attachments = defineTable({
  submission: v.id("submissions"),
  organisation: v.id("organisations"),
  name: v.string(),
  type: v.string(),
  size: v.number(),
  storageId: v.id("_storage"),
}).index("submission", ["submission"])
  .index("by_organisation", ["organisation"]);

export const createAttachment = mutation({
  args: {
    submission: v.id("submissions"),
    organisation: v.id("organisations"),
    name: v.string(),
    type: v.string(),
    size: v.number(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.organisation);
    if (!org) throw new Error("Organisation not found");

    const planConfig = getPlanConfig(org.plan);
    const limitMB = planConfig.limits.storageLimit;
    const limitBytes = limitMB * 1024 * 1024;

    // Check storage used
    if (limitMB !== Infinity) {
      const existingAttachments = await ctx.db
        .query("attachments")
        .withIndex("by_organisation", (q) => q.eq("organisation", args.organisation))
        .collect();

      const totalUsedBytes = existingAttachments.reduce((sum, att) => sum + att.size, 0);

      if (totalUsedBytes + args.size > limitBytes) {
        // Clean up the uploaded file since we are rejecting it
        await ctx.storage.delete(args.storageId);
        throw new Error(
          `You have reached the limit of ${limitMB}MB storage for your ${planConfig.name} plan. Please upgrade to add more.`
        );
      }
    }

    const id = await ctx.db.insert("attachments", {
      submission: args.submission,
      organisation: args.organisation,
      name: args.name,
      type: args.type,
      size: args.size,
      storageId: args.storageId,
    });
    return id;
  },
});

export const getAttachmentsBySubmission = query({
  args: {
    submissionId: v.id("submissions"),
  },
  handler: async (ctx, args) => {
    const attachments = await ctx.db
      .query("attachments")
      .withIndex("submission", (q) => q.eq("submission", args.submissionId))
      .collect();

    return await Promise.all(
      attachments.map(async (attachment) => ({
        ...attachment,
        url: await ctx.storage.getUrl(attachment.storageId),
      })),
    );
  },
});

export const getStorageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getAttachment = query({
  args: {
    attachmentId: v.id("attachments"),
  },
  handler: async (ctx, args) => {
    const attachment = await ctx.db.get(args.attachmentId);
    return attachment;
  },
});

export const deleteAttachment = mutation({
  args: {
    attachmentId: v.id("attachments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.attachmentId);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getUserAttachments = query({
  args: {
    userEmail: v.string(),
    organization: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    // 1. Get submissions for this org (and optionally user, though access control might be tricky)
    // For now, let's fetch ALL submissions for the org, then filter or join.
    // If we want "User Attachments", we probably mean attachments uploaded BY the user (during submission)
    // OR attachments accessible to the user (dashboard view).
    // Since this is "Storage Page" in dashboard, it likely lists all attachments for the ORG.
    // The userEmail arg might be for future filtering or access control.

    // Fetch submissions for the organization
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("organisation", (q) => q.eq("organisation", args.organization))
      .collect();

    if (submissions.length === 0) return [];

    const submissionIds = submissions.map((s) => s._id);

    // This is not efficient for huge datasets, but Convex doesn't have "IN" query yet mostly.
    // We can limit this or loop.
    // Or we can query attachments and filter (requires scanning attachments).
    // Better: Query attachments (which are indexed by submission?)
    // Attachments are indexed by "submission".
    // We have to iterate submissions and fetch attachments for each.

    const allAttachments = await Promise.all(
      submissionIds.map(async (subId) => {
        const atts = await ctx.db
          .query("attachments")
          .withIndex("submission", (q) => q.eq("submission", subId))
          .collect();
        return atts;
      }),
    );

    const flatAttachments = allAttachments.flat();
    flatAttachments.sort((a, b) => b._creationTime - a._creationTime);

    return await Promise.all(
      flatAttachments.map(async (attachment) => ({
        ...attachment,
        url: await ctx.storage.getUrl(attachment.storageId),
      })),
    );
  },
});
