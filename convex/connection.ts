import { defineTable } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const connections = defineTable({
  email: v.string(),
  service: v.optional(v.string()), // Track which service they used
  status: v.union(
    v.literal("Active"),
    v.literal("Warning"),
    v.literal("Alert"),
  ),
  organisation: v.id("organisations"),
  lastSubmission: v.id("submissions"),
  submissionCount: v.optional(v.number()),
}).index("organisation", ["organisation"]);

export const getConnections = query({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) return [];

    const isOwner = organisation.owner === userId;
    let allowedServices: string[] | undefined = undefined;
    let role: "owner" | "editor" | "viewer" | null = null;

    if (isOwner) {
      role = "owner";
    } else {
      const membership = await ctx.db
        .query("organisationMembers")
        .withIndex("user_org_index", (q) =>
          q.eq("userId", userId).eq("organisationId", args.organisationId)
        )
        .first();

      if (!membership) return [];
      role = membership.role;
      allowedServices = membership.allowedServices;
    }

    let results = await ctx.db
      .query("connections")
      .withIndex("organisation", (q) => q.eq("organisation", args.organisationId))
      .collect();

    // Filter by allowed services for viewer role
    if (role === "viewer" && allowedServices !== undefined) {
      results = results.filter((c) =>
        c.service && allowedServices!.includes(c.service)
      );
    }

    return results;
  },
});
