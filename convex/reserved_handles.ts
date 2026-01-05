import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
// import reservedHandlesData from "./reserved_handles.json"; // Removed


// --- Helpers ---

const generateKey = (length = 8) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// --- Internal Mutations (Admin/System) ---

// seedReservedHandles removed as we use `convex import`


export const seedKeys = internalMutation({
    args: {},
    handler: async (ctx) => {
        // 1. Ensure Master Key
        const masterKey = await ctx.db
            .query("redemptionKeys")
            .filter((q) => q.eq(q.field("type"), "master"))
            .first();

        if (!masterKey) {
            await ctx.db.insert("redemptionKeys", {
                key: "MASTER-" + generateKey(12).toUpperCase(), // Explicit master key format
                type: "master",
            });
        }

        // 2. Replenish Standard Keys
        // We can't call the mutation wrapper directly with ctx usually unless we use ctx.runMutation, but since we are inside a mutation, 
        // we can just call the logic if we extracted it, or use the scheduler. 
        // Simplest is to just replicate the logic here or extract it. 
        // Let's extract it to avoid duplication.
        await replenishKeysLogic(ctx);
    },
});

const replenishKeysLogic = async (ctx: any) => {
    const desiredCount = 15;
    const currentKeys = await ctx.db
        .query("redemptionKeys")
        .filter((q: any) => q.eq(q.field("type"), "standard"))
        .collect();

    const needed = desiredCount - currentKeys.length;
    if (needed > 0) {
        for (let i = 0; i < needed; i++) {
            await ctx.db.insert("redemptionKeys", {
                key: generateKey(8),
                type: "standard",
            });
        }
    }
    return { added: Math.max(0, needed) };
};

export const replenishKeys = internalMutation({
    args: {},
    handler: async (ctx) => {
        return await replenishKeysLogic(ctx);
    },
});


// --- Public Mutations ---

export const redeemReservedHandle = mutation({
    args: {
        handle: v.string(),
        key: v.string(),
        orgId: v.id("organisations"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Unauthenticated");
        }

        // 1. Validate Handle
        const reserved = await ctx.db
            .query("reservedHandles")
            .withIndex("by_handle", (q) => q.eq("handle", args.handle))
            .unique();

        if (!reserved) {
            // Check if it's already acquired
            const acquired = await ctx.db.query("acquiredHandles").withIndex("by_handle", q => q.eq("handle", args.handle)).unique();
            if (acquired) throw new Error("Handle already acquired");

            throw new Error("Handle is not reserved");
        }

        // 2. Validate Key
        const keyRecord = await ctx.db
            .query("redemptionKeys")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();

        if (!keyRecord) {
            throw new Error("Invalid redemption key");
        }

        // 3. Permission Check
        if (reserved.type === "official" && keyRecord.type !== "master") {
            throw new Error("This handle requires an official master key.");
        }

        // 4. Execute Redemption
        await ctx.db.insert("acquiredHandles", {
            handle: args.handle,
            keyUsed: args.key,
            orgId: args.orgId,
            userId: userId,
            acquiredAt: Date.now(),
        });

        // 5. Cleanup
        await ctx.db.delete(reserved._id);

        if (keyRecord.type === "standard") {
            await ctx.db.delete(keyRecord._id);
            // We cannot call internalMutation from mutation directly usually, 
            // but we can schedule it or just inline the replenish logic if critical.
            // However, user Requirement: "get replaced after use so there will always be the specified amount at al times"
            // Best approach: Schedule the replenishment
            await ctx.scheduler.runAfter(0, (internal as any).reserved_handles.replenishKeys, {});
        }

        return { success: true };
    },
});
