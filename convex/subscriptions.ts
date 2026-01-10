/**
 * Subscriptions Table Definition
 *
 * Stores subscription data synced from Lemon Squeezy webhooks.
 */

import { defineTable } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const subscriptions = defineTable({
  // Organisation relationship
  organisationId: v.id("organisations"),

  // Lemon Squeezy IDs
  lemonSqueezyId: v.string(),
  lemonSqueezyCustomerId: v.string(),
  productId: v.string(),
  variantId: v.string(),

  // Subscription details
  status: v.string(), // SubscriptionStatus
  planId: v.string(), // SubscriptionPlan

  // Billing dates (stored as Unix timestamps in milliseconds)
  currentPeriodStart: v.number(),
  currentPeriodEnd: v.number(),
  trialEndsAt: v.optional(v.number()),
  renewsAt: v.optional(v.number()),
  endsAt: v.optional(v.number()),

  // Payment information
  cardBrand: v.optional(v.string()),
  cardLastFour: v.optional(v.string()),

  // Customer portal URLs (pre-signed, valid for 24 hours)
  updatePaymentMethodUrl: v.optional(v.string()),
  customerPortalUrl: v.optional(v.string()),
})
  .index("by_organisation", ["organisationId"])
  .index("by_lemon_squeezy_id", ["lemonSqueezyId"])
  .index("by_status", ["status"]);

/**
 * Create or update subscription from webhook data
 */
export const upsertSubscription = mutation({
  args: {
    organisationId: v.id("organisations"),
    lemonSqueezyId: v.string(),
    lemonSqueezyCustomerId: v.string(),
    productId: v.string(),
    variantId: v.string(),
    status: v.string(),
    planId: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    trialEndsAt: v.optional(v.number()),
    renewsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    cardBrand: v.optional(v.string()),
    cardLastFour: v.optional(v.string()),
    updatePaymentMethodUrl: v.optional(v.string()),
    customerPortalUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if subscription already exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_lemon_squeezy_id", (q) =>
        q.eq("lemonSqueezyId", args.lemonSqueezyId),
      )
      .first();

    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, args);

      await ctx.db.patch(args.organisationId, {
        plan: args.planId,
        subscriptionStatus: args.status,
      });

      return existing._id;
    } else {
      // Create new subscription
      const subscriptionId = await ctx.db.insert("subscriptions", args);

      await ctx.db.patch(args.organisationId, {
        plan: args.planId,
        subscriptionStatus: args.status,
      });

      return subscriptionId;
    }
  },
});

/**
 * Update subscription status (called from webhooks)
 */
export const updateSubscriptionStatus = mutation({
  args: {
    lemonSqueezyId: v.string(),
    status: v.string(),
    renewsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_lemon_squeezy_id", (q) =>
        q.eq("lemonSqueezyId", args.lemonSqueezyId),
      )
      .first();

    if (!subscription) {
      throw new Error(`Subscription not found: ${args.lemonSqueezyId}`);
    }

    await ctx.db.patch(subscription._id, {
      status: args.status,
      renewsAt: args.renewsAt,
      endsAt: args.endsAt,
    });

    // If subscription expires, revert organisation to free plan
    const newPlan = args.status === 'expired' ? 'free' : subscription.planId;

    await ctx.db.patch(subscription.organisationId, {
      plan: newPlan,
      subscriptionStatus: args.status,
    });

    return subscription._id;
  },
});

/**
 * Update subscription plan (called from webhooks when plan changes)
 */
export const updateSubscriptionPlan = mutation({
  args: {
    lemonSqueezyId: v.string(),
    variantId: v.string(),
    planId: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_lemon_squeezy_id", (q) =>
        q.eq("lemonSqueezyId", args.lemonSqueezyId),
      )
      .first();

    if (!subscription) {
      throw new Error(`Subscription not found: ${args.lemonSqueezyId}`);
    }

    await ctx.db.patch(subscription._id, {
      variantId: args.variantId,
      planId: args.planId,
    });

    await ctx.db.patch(subscription.organisationId, {
      plan: args.planId,
      subscriptionStatus: subscription.status,
    });

    return subscription._id;
  },
});

/**
 * Delete subscription (called when subscription is permanently deleted)
 */
export const deleteSubscription = mutation({
  args: {
    lemonSqueezyId: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_lemon_squeezy_id", (q) =>
        q.eq("lemonSqueezyId", args.lemonSqueezyId),
      )
      .first();

    if (!subscription) {
      return; // Already deleted
    }

    await ctx.db.delete(subscription._id);
    await ctx.db.patch(subscription.organisationId, {
      plan: "free",
      subscriptionStatus: "expired",
    });
  },
});

/**
 * Get subscription by organisation ID
 */
export const getSubscriptionByOrganisation = query({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_organisation", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .first();

    return subscription;
  },
});

/**
 * Get current user's organisation subscription
 */
export const getCurrentUserSubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Get user's primary organisation
    const organisations = await ctx.db
      .query("organisations")
      .withIndex("owner", (q) => q.eq("owner", userId))
      .collect();

    if (organisations.length === 0) return null;

    // Get subscription for first organisation
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_organisation", (q) =>
        q.eq("organisationId", organisations[0]._id),
      )
      .first();

    return subscription;
  },
});

/**
 * Get usage statistics for an organisation
 */
export const getSubscriptionUsage = query({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) return null;

    // Get form for this organisation
    const form = await ctx.db.get(organisation.formId);
    if (!form) return null;

    // Count services
    const servicesCount = form.services?.length || 0;

    // Count submissions for current month
    const now = Date.now();
    const monthStart = new Date(now);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("organisation"), args.organisationId))
      .collect();

    const submissionsThisMonth = submissions.filter(
      (s) => s._creationTime >= monthStart.getTime(),
    ).length;

    // Count total members (including owner)
    const members = await ctx.db
      .query("organisationMembers")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .collect();

    const totalMembersCount = members.length;

    const storageMB = 100; // Placeholder for now

    return {
      services: servicesCount,
      submissions: submissionsThisMonth,
      teamMembers: totalMembersCount,
      storageMB: Math.round(storageMB * 100) / 100,
    };
  },
});

/**
 * Check if an action is allowed under current plan
 */
export const canPerformAction = query({
  args: {
    organisationId: v.id("organisations"),
    action: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) {
      return { allowed: false, reason: "Organisation not found" };
    }

    // Import plan config (we'll need to pass limits from client)
    // For now, return basic structure
    return {
      allowed: true,
      reason: undefined,
    };
  },
});

/**
 * Switch organisation to free plan (local update)
 */
export const switchToFree = mutation({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    // Authorization: only owner can change plans
    if (organisation.owner !== userId) {
      throw new Error("Only the owner can change the subscription plan.");
    }

    // Update organisation to free plan
    await ctx.db.patch(args.organisationId, {
      plan: "free",
      subscriptionStatus: "active",
    });

    // Mark any active subscriptions as cancelled in our DB
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_organisation", (q) => q.eq("organisationId", args.organisationId))
      .collect();

    for (const sub of subscriptions) {
      if (sub.status !== "expired") {
        await ctx.db.patch(sub._id, {
          status: "cancelled",
        });
      }
    }

    return { success: true };
  },
});
