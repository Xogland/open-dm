import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const users = defineTable({
  //default
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),

  //extra
  selectedOrganisation: v.optional(v.id("organisations")),
})
  .index("email", ["email"])
  .index("name", ["name"]);

export const getUser = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    console.log("Get User ", userId);
    console.log("User Identity: ", await ctx.auth.getUserIdentity());
    if (!userId) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});

export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) return;

    // 1. Delete all organisations owned by this user
    const ownedOrganisations = await ctx.db
      .query("organisations")
      .withIndex("owner", (q) => q.eq("owner", userId))
      .collect();

    for (const org of ownedOrganisations) {
      // Cleanup for each organization (similar to deleteOrganisation mutation)

      // Members
      const memberships = await ctx.db
        .query("organisationMembers")
        .withIndex("by_organisation_id", (q) => q.eq("organisationId", org._id))
        .collect();
      await Promise.all(memberships.map((m) => ctx.db.delete(m._id)));

      // Submissions
      const submissions = await ctx.db
        .query("submissions")
        .withIndex("organisation", (q) => q.eq("organisation", org._id))
        .collect();
      await Promise.all(submissions.map((s) => ctx.db.delete(s._id)));

      // Connections
      const connections = await ctx.db
        .query("connections")
        .withIndex("organisation", (q) => q.eq("organisation", org._id))
        .collect();
      await Promise.all(connections.map((c) => ctx.db.delete(c._id)));

      // Form
      if (org.formId) {
        await ctx.db.delete(org.formId);
      }


      // Invites
      const invites = await ctx.db
        .query("teamInvites")
        .withIndex("by_organisation", (q) => q.eq("organisationId", org._id))
        .collect();
      await Promise.all(invites.map((i) => ctx.db.delete(i._id)));

      // Acquired handles
      const acquired = await ctx.db
        .query("acquiredHandles")
        .filter((q) => q.eq(q.field("orgId"), org._id))
        .collect();
      await Promise.all(acquired.map((a) => ctx.db.delete(a._id)));

      // Subscriptions
      const subs = await ctx.db
        .query("subscriptions")
        .withIndex("by_organisation", (q) => q.eq("organisationId", org._id))
        .collect();
      await Promise.all(subs.map((s) => ctx.db.delete(s._id)));

      // Attachments
      const attached = await ctx.db
        .query("attachments")
        .filter((q) => q.eq(q.field("organisation"), org._id))
        .collect();
      for (const a of attached) {
        if (a.storageId) {
          await ctx.storage.delete(a.storageId as Id<"_storage">);
        }
        await ctx.db.delete(a._id);
      }

      // Image
      if (org.image) {
        await ctx.storage.delete(org.image as Id<"_storage">);
      }

      // Delete the org itself
      await ctx.db.delete(org._id);
    }

    // 2. Delete memberships in other organisations
    const otherMemberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();
    await Promise.all(otherMemberships.map((m) => ctx.db.delete(m._id)));

    // 3. Delete referrals
    const ownedReferrals = await ctx.db
      .query("referrals")
      .filter((q) => q.eq(q.field("user"), userId))
      .collect();
    await Promise.all(ownedReferrals.map((r) => ctx.db.delete(r._id)));

    // 4. Delete preregistered status
    const preregistered = await ctx.db
      .query("preregistered")
      .filter((q) => q.eq(q.field("user"), userId))
      .collect();
    await Promise.all(preregistered.map((p) => ctx.db.delete(p._id)));

    // 5. Finally delete the user
    await ctx.db.delete(userId);
  },
});

export const updateSelectedOrganisation = mutation({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user has access to this organization
    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    // Check if user is owner or member
    const isOwner = organisation.owner === userId;
    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", args.organisationId)
      )
      .first();

    if (!isOwner && !membership) {
      throw new Error("You do not have access to this organisation");
    }

    await ctx.db.patch(userId, {
      selectedOrganisation: args.organisationId,
    });
  },
});
