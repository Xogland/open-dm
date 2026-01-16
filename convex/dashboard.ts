import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getPlanConfig } from "./planLimitConfig";
import { getUsageWindow } from "./subscriptions";

export const getUsageStats = query({
    args: {
        organisationId: v.id("organisations"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const org = await ctx.db.get(args.organisationId);
        if (!org) return null;

        // Check if user is member or owner
        const isOwner = org.owner === userId;
        const membership = await ctx.db
            .query("organisationMembers")
            .withIndex("user_org_index", (q) =>
                q.eq("userId", userId).eq("organisationId", args.organisationId)
            )
            .first();

        if (!isOwner && !membership) return null;

        const planConfig = getPlanConfig(org.plan);

        // 1. Calculate submissions this period
        const { windowStart, windowEnd, subscription } = await getUsageWindow(ctx, args.organisationId);

        const submissionsThisMonth = await ctx.db
            .query("submissions")
            .withIndex("organisation", (q) => q.eq("organisation", args.organisationId))
            .filter((q) => q.gte(q.field("_creationTime"), windowStart))
            .collect();

        const submissionCount = submissionsThisMonth.length;
        const submissionLimit = planConfig.limits.submissionsPerMonth;

        // 2. Calculate storage used
        const attachments = await ctx.db
            .query("attachments")
            .withIndex("by_organisation", (q) => q.eq("organisation", args.organisationId))
            .collect();

        const totalUsedBytes = attachments.reduce((sum, att) => sum + att.size, 0);
        const totalUsedMB = totalUsedBytes / (1024 * 1024);
        const storageLimitMB = planConfig.limits.storageLimit;

        return {
            submissions: {
                used: submissionCount,
                limit: submissionLimit,
                remaining: submissionLimit === Infinity ? Infinity : Math.max(0, submissionLimit - submissionCount),
                percentage: submissionLimit === Infinity ? 0 : Math.min(100, (submissionCount / submissionLimit) * 100),
            },
            storage: {
                usedMB: totalUsedMB,
                limitMB: storageLimitMB,
                remainingMB: storageLimitMB === Infinity ? Infinity : Math.max(0, storageLimitMB - totalUsedMB),
                percentage: storageLimitMB === Infinity ? 0 : Math.min(100, (totalUsedMB / storageLimitMB) * 100),
            },
            planName: planConfig.name,
            planRenewalDate: subscription?.currentPeriodEnd || (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime()),
        };
    },
});
