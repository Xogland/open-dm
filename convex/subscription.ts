import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const PLANS = [
  {
    id: "free",
    forms_limit: 1,
    orgs_limit: 1,
  },
  {
    id: "pro",
    forms_limit: 3,
    orgs_limit: Infinity,
  },
  {
    id: "business",
    forms_limit: 5,
    orgs_limit: Infinity,
  },
];

export const checkSubscriptionStatus = query({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, { organisationId }) => {
    const organisation = await ctx.db.get(organisationId);
    if (!organisation) return null;
    const planId = organisation.plan || "free";
    const plan = PLANS.find((p) => p.id === planId) || PLANS[0];

    return {
      plan_id: planId,
      subscription_status: organisation.subscriptionStatus || "active",
      forms_limit: plan.forms_limit,
      orgs_limit: plan.orgs_limit,
    };
  },
});

export const debugUpdateSubscription = mutation({
  args: {
    organisationId: v.optional(v.id("organisations")),
    planId: v.string(),
    subscriptionStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get user's organisations to find which one to update
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const organisations = await ctx.db
      .query("organisations")
      .filter((q) => q.eq(q.field("owner"), userId))
      .collect();

    if (organisations.length === 0) throw new Error("No organisations found");

    const targetOrgId = args.organisationId || organisations[0]._id;

    await ctx.db.patch(targetOrgId, {
      plan: args.planId,
      subscriptionStatus: args.subscriptionStatus || "active",
    });
  },
});
