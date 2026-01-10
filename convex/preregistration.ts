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
