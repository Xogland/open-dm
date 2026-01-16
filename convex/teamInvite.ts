import { defineTable } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

import { getPlanConfig } from "./planLimitConfig";

export const teamInvites = defineTable({
    organisationId: v.id("organisations"),
    invitedBy: v.id("users"),
    role: v.union(
        v.literal("editor"),
        v.literal("viewer")
    ),
    allowedServices: v.optional(v.array(v.string())), // Service IDs. undefined = All.
    token: v.string(), // Unique invite token
    status: v.union(
        v.literal("pending"),
        v.literal("accepted"),
        v.literal("expired"),
        v.literal("cancelled")
    ),
    expiresAt: v.number(), // Timestamp
})
    .index("by_organisation", ["organisationId"])
    .index("by_token", ["token"])
    .index("by_status", ["status"]);

// Generate a random invite token
function generateInviteToken(): string {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

export const createInvite = mutation({
    args: {
        organisationId: v.id("organisations"),
        role: v.union(
            v.literal("editor"),
            v.literal("viewer")
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const organisation = await ctx.db.get(args.organisationId);
        if (!organisation) throw new Error("Organisation not found");

        // Only owner and editor can create invites
        const membership = await ctx.db
            .query("organisationMembers")
            .withIndex("user_org_index", (q) =>
                q.eq("userId", userId).eq("organisationId", args.organisationId)
            )
            .first();

        const isOwner = organisation.owner === userId;
        const isEditor = membership?.role === "editor";

        if (!isOwner && !isEditor) {
            throw new Error("Only owner or editor can create invites");
        }

        // Check subscription plan limits
        const planConfig = getPlanConfig(organisation.plan);
        const subscriptionStatus = organisation.subscriptionStatus || "active";

        if (subscriptionStatus !== "active") {
            throw new Error("Cannot create invites with inactive subscription");
        }

        const limit = planConfig.limits.teamMembersLimit;
        if (limit !== Infinity) {
            // Count total members (including owner)
            const members = await ctx.db
                .query("organisationMembers")
                .withIndex("by_organisation_id", (q) =>
                    q.eq("organisationId", args.organisationId)
                )
                .collect();

            const totalMemberCount = members.length;

            // Count pending invites
            const invites = await ctx.db
                .query("teamInvites")
                .withIndex("by_organisation", (q) =>
                    q.eq("organisationId", args.organisationId)
                )
                .collect();

            const pendingInviteCount = invites.filter(i => i.status === "pending").length;

            if (totalMemberCount + pendingInviteCount >= limit + 1) { // limit is EXTRA members, so total is limit + 1
                throw new Error(
                    `You have reached the limit of ${limit + 1} total members for your ${planConfig.name} plan. Please upgrade to add more.`
                );
            }
        }

        // Generate unique token
        let token = generateInviteToken();
        let existing = await ctx.db
            .query("teamInvites")
            .withIndex("by_token", (q) => q.eq("token", token))
            .first();

        // Ensure token is unique
        while (existing) {
            token = generateInviteToken();
            existing = await ctx.db
                .query("teamInvites")
                .withIndex("by_token", (q) => q.eq("token", token))
                .first();
        }

        // Set expiry to 15 days from now
        const expiresAt = Date.now() + 15 * 24 * 60 * 60 * 1000;

        const inviteId = await ctx.db.insert("teamInvites", {
            organisationId: args.organisationId,
            invitedBy: userId,
            role: args.role,
            allowedServices: [], // Start with NO access. undefined = All.
            token,
            status: "pending",
            expiresAt,
        });

        return { inviteId, token };
    },
});

export const getInviteByToken = query({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        const invite = await ctx.db
            .query("teamInvites")
            .withIndex("by_token", (q) => q.eq("token", args.token))
            .first();

        if (!invite) return null;

        // Check if expired (don't patch in query, just compute status)
        const isExpired = invite.expiresAt < Date.now() && invite.status === "pending";

        const organisation = await ctx.db.get(invite.organisationId);
        if (!organisation) return null;

        const inviter = await ctx.db.get(invite.invitedBy);

        return {
            ...invite,
            status: isExpired ? ("expired" as const) : invite.status,
            organisation: {
                ...organisation,
                image: organisation.image
                    ? await ctx.storage.getUrl(organisation.image)
                    : undefined,
            },
            inviterName: inviter?.name || "Unknown",
        };
    },
});

export const getOrganisationInvites = query({
    args: { organisationId: v.id("organisations") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const organisation = await ctx.db.get(args.organisationId);
        if (!organisation) return [];

        // Only owner and editor can view invites
        const membership = await ctx.db
            .query("organisationMembers")
            .withIndex("user_org_index", (q) =>
                q.eq("userId", userId).eq("organisationId", args.organisationId)
            )
            .first();

        const isOwner = organisation.owner === userId;
        const isEditor = membership?.role === "editor";

        if (!isOwner && !isEditor) {
            return [];
        }

        const invites = await ctx.db
            .query("teamInvites")
            .withIndex("by_organisation", (q) =>
                q.eq("organisationId", args.organisationId)
            )
            .order("desc")
            .collect();

        return Promise.all(
            invites.map(async (invite) => {
                const inviter = await ctx.db.get(invite.invitedBy);
                return {
                    ...invite,
                    inviterName: inviter?.name || "Unknown",
                };
            })
        );
    },
});

export const cancelInvite = mutation({
    args: { inviteId: v.id("teamInvites") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const invite = await ctx.db.get(args.inviteId);
        if (!invite) throw new Error("Invite not found");

        const organisation = await ctx.db.get(invite.organisationId);
        if (!organisation) throw new Error("Organisation not found");

        // Only owner and editor can cancel invites
        const membership = await ctx.db
            .query("organisationMembers")
            .withIndex("user_org_index", (q) =>
                q.eq("userId", userId).eq("organisationId", invite.organisationId)
            )
            .first();

        const isOwner = organisation.owner === userId;
        const isEditor = membership?.role === "editor";

        if (!isOwner && !isEditor) {
            throw new Error("Only owner or editor can cancel invites");
        }

        await ctx.db.patch(args.inviteId, { status: "cancelled" });
    },
});

export const acceptInvite = mutation({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const invite = await ctx.db
            .query("teamInvites")
            .withIndex("by_token", (q) => q.eq("token", args.token))
            .first();

        if (!invite) throw new Error("Invite not found");

        if (invite.status !== "pending") {
            throw new Error(`Invite is ${invite.status}`);
        }

        if (invite.expiresAt < Date.now()) {
            await ctx.db.patch(invite._id, { status: "expired" });
            throw new Error("Invite has expired");
        }

        const organisation = await ctx.db.get(invite.organisationId);
        if (!organisation) throw new Error("Organisation not found");

        // Check if user is already a member
        const existingMembership = await ctx.db
            .query("organisationMembers")
            .withIndex("user_org_index", (q) =>
                q.eq("userId", userId).eq("organisationId", invite.organisationId)
            )
            .first();

        if (existingMembership) {
            throw new Error("You are already a member of this organisation");
        }

        // Create membership
        await ctx.db.insert("organisationMembers", {
            organisationId: invite.organisationId,
            userId: userId,
            role: invite.role,
            status: "active",
            allowedServices: invite.allowedServices,
            formsWithAccess: [organisation.formId],
        });

        // Mark invite as accepted
        await ctx.db.patch(invite._id, { status: "accepted" });

        // Auto-select the newly joined organization
        await ctx.db.patch(userId, {
            selectedOrganisation: invite.organisationId,
        });

        return invite.organisationId;
    },
});
