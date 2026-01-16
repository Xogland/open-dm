import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addToPreregistration = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const existing = await ctx.db
            .query("preregistered")
            .filter((q) => q.eq(q.field("user"), userId))
            .first();

        if (!existing) {
            await ctx.db.insert("preregistered", {
                user: userId,
            });
        }
    },
});

export const isPreregistered = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return false;

        const existing = await ctx.db
            .query("preregistered")
            .filter((q) => q.eq(q.field("user"), userId))
            .first();

        return !!existing;
    },
});

export const checkDiscountEligibility = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return { eligible: false };

        // 1. Check if user is in preregistered table
        const preregistered = await ctx.db
            .query("preregistered")
            .filter((q) => q.eq(q.field("user"), userId))
            .first();

        if (!preregistered) {
            return { eligible: false };
        }

        // 2. Check if user's organisations have any existing subscriptions
        // Get all organisations owned by the user
        const organisations = await ctx.db
            .query("organisations")
            .withIndex("owner", (q) => q.eq("owner", userId))
            .collect();

        for (const org of organisations) {
            const subscription = await ctx.db
                .query("subscriptions")
                .withIndex("by_organisation", (q) => q.eq("organisationId", org._id))
                .filter((q) => q.neq(q.field("status"), "expired"))
                .first();

            if (subscription) {
                return { eligible: false, reason: "Already has an active or past subscription" };
            }
        }

        return { eligible: true };
    },
});
