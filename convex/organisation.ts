import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { defineTable } from "convex/server";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// import { RESERVED_HANDLES } from "./reserved-handles"; // Removed

// Organization creation limit per user
const ORGANISATION_LIMIT = 15;

export const Role = v.union(
  v.literal("owner"),
  v.literal("editor"),
  v.literal("viewer"),
);

export const organisations = defineTable({
  name: v.string(),
  handle: v.string(),
  owner: v.id("users"),
  formId: v.id("forms"), // Required - each organisation has exactly one form
  image: v.optional(v.string()),
  plan: v.string(), // 'free', 'beginner', 'pro', 'max'
  subscriptionStatus: v.optional(v.string()), // 'on_trial', 'active', 'paused', 'past_due', 'unpaid', 'cancelled', 'expired'
  category: v.optional(v.string()),
  businessType: v.optional(v.string()),
  statuses: v.optional(
    v.array(
      v.object({
        id: v.string(),
        label: v.string(),
        color: v.string(),
        isDefault: v.boolean(),
      }),
    ),
  ),
})
  .index("owner", ["owner"])
  .index("handle", ["handle"]);

export const orgSettings = defineTable({
  organisationId: v.id("organisations"),
  key: v.string(), // e.g., "debugMode"
  value: v.any(),
}).index("by_organisation_key", ["organisationId", "key"]);

export const orgStats = defineTable({
  organisationId: v.id("organisations"),
  metric: v.string(), // e.g., "views"
  value: v.number(),
}).index("by_organisation_metric", ["organisationId", "metric"]);

export const thirdPartyConfigs = defineTable({
  organisationId: v.id("organisations"),
  provider: v.union(v.literal("stripe"), v.literal("google"), v.literal("custom")),
  config: v.any(),
  updatedAt: v.number(),
}).index("by_organisation_provider", ["organisationId", "provider"]);

export const incrementView = mutation({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orgStats")
      .withIndex("by_organisation_metric", (q) =>
        q.eq("organisationId", args.organisationId).eq("metric", "views")
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: existing.value + 1,
      });
    } else {
      await ctx.db.insert("orgStats", {
        organisationId: args.organisationId,
        metric: "views",
        value: 1,
      });
    }
  },
});

export const organisationMembers = defineTable({
  organisationId: v.id("organisations"),
  userId: v.id("users"),
  role: Role,
  status: v.union(v.literal("active"), v.literal("inactive")), // For subscription expiry handling
  allowedServices: v.optional(v.array(v.string())), // Service IDs for restricted access. undefined = All.
  formsWithAccess: v.array(v.id("forms")),
  serviceEscalation: v.optional(v.any()), // Map of serviceId -> { email: string, enabled: boolean }
})
  .index("by_user_id", ["userId"])
  .index("by_organisation_id", ["organisationId"])
  .index("user_org_index", ["userId", "organisationId"]);

export const checkOrganisationHandle = query({
  args: { handle: v.string(), key: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let handle = args.handle.toLowerCase();

    // Check if it's a bypass attempt
    const isBypass = handle.startsWith("\u200b");
    if (isBypass) {
      handle = handle.slice(1);
    }

    if (!isBypass) {
      const reserved = await ctx.db
        .query("reservedHandles")
        .withIndex("by_handle", (q) => q.eq("handle", handle))
        .first();

      if (reserved) {
        // If a key is provided, validate it
        if (args.key) {
          const keyRecord = await ctx.db
            .query("redemptionKeys")
            .withIndex("by_key", (q) => q.eq("key", args.key!))
            .unique();

          if (keyRecord) {
            const isValid =
              reserved.type === "official" ? keyRecord.type === "master" : true;
            if (isValid) {
              return { status: "available" };
            }
          }
        }

        return {
          status: "reserved",
          type: reserved.type,
          message:
            reserved.type === "official"
              ? "This handle is not available."
              : "This handle is reserved. Please contact support to acquire it.",
        };
      }
    }

    const existing = await ctx.db
      .query("organisations")
      .withIndex("handle", (q) => q.eq("handle", handle))
      .first();

    if (existing) {
      return { status: "taken", message: "This handle is already taken." };
    }

    return { status: "available" };
  },
});

export const getReservedHandles = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // In a real app, you might want check if the user is an admin.
    // For now, we'll just return it as requested.
    // Return all reserved handles from DB
    const reserved = await ctx.db.query("reservedHandles").collect();
    return reserved.map((r) => r.handle);
  },
});

export const updateOrganisationName = mutation({
  args: {
    organisationId: v.id("organisations"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    if (organisation.owner !== userId) {
      throw new Error("Only the owner can update the organisation.");
    }

    await ctx.db.patch(args.organisationId, {
      name: args.name,
    });
  },
});

export const updateOrganisationStatuses = mutation({
  args: {
    organisationId: v.id("organisations"),
    statuses: v.array(
      v.object({
        id: v.string(),
        label: v.string(),
        color: v.string(),
        isDefault: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", args.organisationId),
      )
      .first();

    if (organisation.owner !== userId && membership?.role !== "editor") {
      throw new Error("Only owners or editors can update statuses");
    }

    if (args.statuses.length > 10) {
      throw new Error("Cannot have more than 10 statuses");
    }

    await ctx.db.patch(args.organisationId, {
      statuses: args.statuses,
    });
  },
});

export const updateOrganisationImage = mutation({
  args: {
    organisationId: v.id("organisations"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    if (organisation.owner !== userId) {
      throw new Error("Only the owner can update the organisation.");
    }

    // Delete old image if it exists and is different from new one
    if (organisation.image && organisation.image !== args.storageId) {
      try {
        await ctx.storage.delete(organisation.image as Id<"_storage">);
      } catch (e) {
        console.log(e);
      }
    }

    await ctx.db.patch(args.organisationId, {
      image: args.storageId,
    });
  },
});

export const removeOrganisationImage = mutation({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    if (organisation.owner !== userId) {
      throw new Error("Only the owner can update the organisation.");
    }

    if (organisation.image) {
      await ctx.storage.delete(organisation.image as Id<"_storage">);
    }

    await ctx.db.patch(args.organisationId, {
      image: undefined,
    });
  },
});

export const createOrganisation = mutation({
  args: {
    name: v.string(),
    handle: v.string(),
    category: v.optional(v.string()),
    businessType: v.optional(v.string()),
    redemptionKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Check organization limit
    const ownedOrganisations = await ctx.db
      .query("organisations")
      .withIndex("owner", (q) => q.eq("owner", userId))
      .collect();

    if (ownedOrganisations.length >= ORGANISATION_LIMIT) {
      throw new Error(
        `You have reached the maximum limit of ${ORGANISATION_LIMIT} organizations. Please contact us if you need more.`,
      );
    }

    // Check handle uniqueness and reservation
    let handle = args.handle.toLowerCase();
    const isBypass = handle.startsWith("\u200b");

    if (isBypass) {
      handle = handle.slice(1);
    }

    if (!isBypass) {
      const reserved = await ctx.db
        .query("reservedHandles")
        .withIndex("by_handle", (q) => q.eq("handle", handle))
        .first();

      if (reserved) {
        // Redmeption Logic
        if (!args.redemptionKey) {
          throw new Error(
            reserved.type === "official"
              ? "This handle is not available."
              : "This handle is reserved. You need a redemption key to use it.",
          );
        }

        const keyRecord = await ctx.db
          .query("redemptionKeys")
          .withIndex("by_key", (q) => q.eq("key", args.redemptionKey!))
          .unique();

        if (!keyRecord) throw new Error("Invalid redemption key.");

        if (reserved.type === "official" && keyRecord.type !== "master") {
          throw new Error("This handle requires an official master key.");
        }

        // Mark for cleanup (will execute after valid handle check)
      }
    }

    const existing = await ctx.db
      .query("organisations")
      .withIndex("handle", (q) => q.eq("handle", handle))
      .first();

    if (existing) {
      throw new Error("Organisation handle already taken.");
    }

    // If reserved and valid key passed (logic above would throw otherwise), cleanup reservation
    // Re-fetch reserved to be safe in transaction or reuse if simpler?
    // We can just rely on the fact we passed the check.
    // However, to do the transaction updates:
    if (!isBypass) {
      const reserved = await ctx.db
        .query("reservedHandles")
        .withIndex("by_handle", (q) => q.eq("handle", handle))
        .first();

      if (reserved && args.redemptionKey) {
        // 1. Remove from reserved
        await ctx.db.delete(reserved._id);

        // 2. Consume key if standard
        const keyRecord = await ctx.db
          .query("redemptionKeys")
          .withIndex("by_key", (q) => q.eq("key", args.redemptionKey!))
          .unique();

        if (keyRecord && keyRecord.type === "standard") {
          await ctx.db.delete(keyRecord._id);
          await ctx.scheduler.runAfter(
            0,
            (internal as any).reserved_handles.replenishKeys,
            {},
          );
        }

        // 3. We don't have orgId yet, so we insert into acquiredHandles AFTER creating org
      }
    }

    // Create the form first
    const formId = await ctx.db.insert("forms", {
      name: args.name,
      createdBy: userId,
      properties: {
        description: "Welcome! Tell us how we can help you.",
        contactInfo: {
          type: "email",
          email: "",
        },
      },
      services: [{ id: "1", title: "General Inquiry" }],
      workflows: {},
    });

    // Create organisation with formId
    const organisationId = await ctx.db.insert("organisations", {
      name: args.name,
      handle: handle,
      owner: userId,
      formId: formId,
      plan: "free",
      subscriptionStatus: "active",
      category: args.category,
      businessType: args.businessType,
      statuses: [
        { id: "new", label: "New", color: "#64748b", isDefault: true },
        {
          id: "review",
          label: "In Review",
          color: "#6366f1",
          isDefault: false,
        },
        { id: "working", label: "Working", color: "#3b82f6", isDefault: false },
        {
          id: "completed",
          label: "Completed",
          color: "#22c55e",
          isDefault: false,
        },
      ],
    });

    // Create membership for owner
    await ctx.db.insert("organisationMembers", {
      organisationId: organisationId,
      userId: userId,
      role: "owner",
      status: "active",
      allowedServices: undefined, // Owner has access to all services
      formsWithAccess: [formId],
    });

    // Finalize redemption recording if applicable
    if (!isBypass && args.redemptionKey) {
      // We essentially duplicate the "acquiredHandles" logic here since we didn't call the mutation
      // But we need to ensure we only do this if it was actually reserved.
      // Re-check not needed as we acquired it by deleting the reservation above?
      // Yes, we deleted reserved handle above. Ideally we record it in acquiredHandles now.
      await ctx.db.insert("acquiredHandles", {
        handle: handle,
        keyUsed: args.redemptionKey!,
        orgId: organisationId,
        userId: userId,
        acquiredAt: Date.now(),
      });
    }

    // Auto-select the newly created organization
    await ctx.db.patch(userId, {
      selectedOrganisation: organisationId,
    });

    return organisationId;
  },
});

export const joinOrganisation = mutation({
  args: {
    organisationId: v.id("organisations"),
    role: v.optional(Role),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    const existingMembership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", args.organisationId),
      )
      .first();

    if (existingMembership) return args.organisationId;

    await ctx.db.insert("organisationMembers", {
      organisationId: args.organisationId,
      userId: userId,
      role: args.role ?? "viewer",
      status: "active",
      allowedServices: [], // Start with NO access. undefined = All.
      formsWithAccess: [],
    });

    return args.organisationId;
  },
});

export const leaveOrganisation = mutation({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    if (organisation.owner === userId) {
      throw new Error(
        "Owner cannot leave. Please use deleteOrganisation instead.",
      );
    }

    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", args.organisationId),
      )
      .first();

    if (!membership) throw new Error("Membership not found");

    await ctx.db.delete(membership._id);

    return true;
  },
});

export const deleteOrganisation = mutation({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    if (organisation.owner !== userId) {
      throw new Error("Only the organisation owner can delete it.");
    }

    // 1. Delete all members
    const memberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .collect();
    await Promise.all(memberships.map((m) => ctx.db.delete(m._id)));

    // 2. Delete all submissions
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("organisation", (q) =>
        q.eq("organisation", args.organisationId),
      )
      .collect();
    await Promise.all(submissions.map((s) => ctx.db.delete(s._id)));

    // 3. Delete all connections
    const connections = await ctx.db
      .query("connections")
      .withIndex("organisation", (q) =>
        q.eq("organisation", args.organisationId),
      )
      .collect();
    await Promise.all(connections.map((c) => ctx.db.delete(c._id)));

    // 4. Delete the form
    if (organisation.formId) {
      await ctx.db.delete(organisation.formId);
    }

    // 6. Delete team invites
    const invites = await ctx.db
      .query("teamInvites")
      .withIndex("by_organisation", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .collect();
    await Promise.all(invites.map((i) => ctx.db.delete(i._id)));

    // 7. Delete acquired handles
    const acquired = await ctx.db
      .query("acquiredHandles")
      .filter((q) => q.eq(q.field("orgId"), args.organisationId))
      .collect();
    await Promise.all(acquired.map((a) => ctx.db.delete(a._id)));

    // 8. Delete subscriptions
    const subs = await ctx.db
      .query("subscriptions")
      .withIndex("by_organisation", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .collect();
    await Promise.all(subs.map((s) => ctx.db.delete(s._id)));

    // 9. Delete attachments
    const attached = await ctx.db
      .query("attachments")
      .filter((q) => q.eq(q.field("organisation"), args.organisationId))
      .collect();
    for (const a of attached) {
      if (a.storageId) {
        await ctx.storage.delete(a.storageId as Id<"_storage">);
      }
      await ctx.db.delete(a._id);
    }

    // 10. Delete organization image if exists
    if (organisation.image) {
      await ctx.storage.delete(organisation.image as Id<"_storage">);
    }

    // 11. Update users who had this as selectedOrganisation
    const usersWithSelected = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("selectedOrganisation"), args.organisationId))
      .collect();
    await Promise.all(
      usersWithSelected.map((u) =>
        ctx.db.patch(u._id, { selectedOrganisation: undefined }),
      ),
    );

    // 12. Finally, delete the organisation
    await ctx.db.delete(args.organisationId);

    return true;
  },
});

export const getOrganisation = query({
  args: {
    id: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.id);
    if (!org) return null;

    // Get stats and settings
    const [stripeConfigDoc, viewsDoc, debugModeDoc] = await Promise.all([
      ctx.db
        .query("thirdPartyConfigs")
        .withIndex("by_organisation_provider", (q) =>
          q.eq("organisationId", args.id).eq("provider", "stripe")
        )
        .unique(),
      ctx.db
        .query("orgStats")
        .withIndex("by_organisation_metric", (q) =>
          q.eq("organisationId", args.id).eq("metric", "views")
        )
        .unique(),
      ctx.db
        .query("orgSettings")
        .withIndex("by_organisation_key", (q) =>
          q.eq("organisationId", args.id).eq("key", "debugMode")
        )
        .unique(),
    ]);

    // Redact secret key for the client
    const stripeConfig = stripeConfigDoc?.config ? {
      publishableKey: stripeConfigDoc.config.publishableKey,
    } : undefined;

    return {
      ...org,
      stripeConfig,
      views: viewsDoc?.value ?? 0,
      debugMode: !!debugModeDoc?.value,
      image: org.image ? await ctx.storage.getUrl(org.image) : undefined,
    };
  },
});

export const getOrganisationInternal = internalQuery({
  args: {
    id: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.id);
    if (!org) return null;

    const [stripeConfigDoc, viewsDoc, debugModeDoc] = await Promise.all([
      ctx.db
        .query("thirdPartyConfigs")
        .withIndex("by_organisation_provider", (q) =>
          q.eq("organisationId", args.id).eq("provider", "stripe")
        )
        .unique(),
      ctx.db
        .query("orgStats")
        .withIndex("by_organisation_metric", (q) =>
          q.eq("organisationId", args.id).eq("metric", "views")
        )
        .unique(),
      ctx.db
        .query("orgSettings")
        .withIndex("by_organisation_key", (q) =>
          q.eq("organisationId", args.id).eq("key", "debugMode")
        )
        .unique(),
    ]);

    return {
      ...org,
      stripeConfig: stripeConfigDoc?.config,
      views: viewsDoc?.value ?? 0,
      debugMode: !!debugModeDoc?.value,
    };
  },
});

export const getUserOrganisations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const ownedOrganisations = await ctx.db
      .query("organisations")
      .withIndex("owner", (q) => q.eq("owner", userId))
      .collect();

    return await Promise.all(
      ownedOrganisations.map(async (org) => {
        // Get stats, settings, and config
        const [stripeConfigDoc, viewsDoc, debugModeDoc] = await Promise.all([
          ctx.db
            .query("thirdPartyConfigs")
            .withIndex("by_organisation_provider", (q) =>
              q.eq("organisationId", org._id).eq("provider", "stripe")
            )
            .unique(),
          ctx.db
            .query("orgStats")
            .withIndex("by_organisation_metric", (q) =>
              q.eq("organisationId", org._id).eq("metric", "views")
            )
            .unique(),
          ctx.db
            .query("orgSettings")
            .withIndex("by_organisation_key", (q) =>
              q.eq("organisationId", org._id).eq("key", "debugMode")
            )
            .unique(),
        ]);

        // Redact secret key for the client
        const stripeConfig = stripeConfigDoc?.config ? {
          publishableKey: stripeConfigDoc.config.publishableKey,
        } : undefined;

        return {
          ...org,
          stripeConfig,
          views: viewsDoc?.value ?? 0,
          debugMode: !!debugModeDoc?.value,
          image: org.image ? await ctx.storage.getUrl(org.image) : undefined,
        };
      }),
    );
  },
});

export const getMemberOrganisations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const memberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    if (memberships.length === 0) return [];

    const organisationIds = memberships.map((m) => m.organisationId);

    const memberOrganisations = await Promise.all(
      organisationIds.map((id) => ctx.db.get(id)),
    );

    const validOrgs = memberOrganisations.filter(
      (org): org is Doc<"organisations"> => Boolean(org),
    );

    return await Promise.all(
      validOrgs.map(async (org) => {
        // Get stats, settings, and config
        const [stripeConfigDoc, viewsDoc, debugModeDoc] = await Promise.all([
          ctx.db
            .query("thirdPartyConfigs")
            .withIndex("by_organisation_provider", (q) =>
              q.eq("organisationId", org._id).eq("provider", "stripe")
            )
            .unique(),
          ctx.db
            .query("orgStats")
            .withIndex("by_organisation_metric", (q) =>
              q.eq("organisationId", org._id).eq("metric", "views")
            )
            .unique(),
          ctx.db
            .query("orgSettings")
            .withIndex("by_organisation_key", (q) =>
              q.eq("organisationId", org._id).eq("key", "debugMode")
            )
            .unique(),
        ]);

        // Redact secret key for the client
        const stripeConfig = stripeConfigDoc?.config ? {
          publishableKey: stripeConfigDoc.config.publishableKey,
        } : undefined;

        return {
          ...org,
          stripeConfig,
          views: viewsDoc?.value ?? 0,
          debugMode: !!debugModeDoc?.value,
          image: org.image ? await ctx.storage.getUrl(org.image) : undefined,
        };
      }),
    );
  },
});

export const getAllUserOrganisations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get owned organizations
    const ownedOrganisations = await ctx.db
      .query("organisations")
      .withIndex("owner", (q) => q.eq("owner", userId))
      .collect();

    // Get member organizations
    const memberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const memberOrganisations = await Promise.all(
      memberships.map((m) => ctx.db.get(m.organisationId)),
    );

    const validMemberOrgs = memberOrganisations.filter(
      (org): org is Doc<"organisations"> =>
        org !== null && org.owner !== userId,
    );

    // Combine and deduplicate
    const allOrgs = [...ownedOrganisations, ...validMemberOrgs];
    allOrgs.sort((a, b) => b._creationTime - a._creationTime);

    return await Promise.all(
      allOrgs.map(async (org) => {
        // Get stats, settings, and config
        const [stripeConfigDoc, viewsDoc, debugModeDoc] = await Promise.all([
          ctx.db
            .query("thirdPartyConfigs")
            .withIndex("by_organisation_provider", (q) =>
              q.eq("organisationId", org._id).eq("provider", "stripe")
            )
            .unique(),
          ctx.db
            .query("orgStats")
            .withIndex("by_organisation_metric", (q) =>
              q.eq("organisationId", org._id).eq("metric", "views")
            )
            .unique(),
          ctx.db
            .query("orgSettings")
            .withIndex("by_organisation_key", (q) =>
              q.eq("organisationId", org._id).eq("key", "debugMode")
            )
            .unique(),
        ]);

        // Redact secret key for the client
        const stripeConfig = stripeConfigDoc?.config ? {
          publishableKey: stripeConfigDoc.config.publishableKey,
        } : undefined;

        return {
          ...org,
          stripeConfig,
          views: viewsDoc?.value ?? 0,
          debugMode: !!debugModeDoc?.value,
          image: org.image ? await ctx.storage.getUrl(org.image) : undefined,
        };
      }),
    );
  },
});

export const getOrganisationMembership = query({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", args.organisationId),
      )
      .first();

    return membership;
  },
});

export const getOrganisationMembers = query({
  args: {
    organisation: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const organisation = await ctx.db.get(args.organisation);
    if (!organisation) return [];

    // Check if requester is a member or owner
    const isOwner = organisation.owner === userId;
    const isMember = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", args.organisation),
      )
      .first();

    if (!isOwner && !isMember) return [];

    const memberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organisationId", args.organisation),
      )
      .collect();

    const membersWithDetails = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        return {
          ...user,
          role: membership.role,
          formsWithAccess: membership.formsWithAccess,
          _id: membership.userId,
        };
      }),
    );

    membersWithDetails.sort((a, b) => (b as any)._creationTime - (a as any)._creationTime);

    return membersWithDetails.filter((m) => m._id);
  },
});

export const getOrganisationMembersWithFormAccess = query({
  args: {
    organisation: v.id("organisations"),
    formId: v.id("forms"),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.organisation);
    if (!organisation) return [];

    const memberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organisationId", args.organisation),
      )
      .collect();

    const membersWithDetails = await Promise.all(
      memberships
        .filter(
          (value) =>
            value.role === "editor" ||
            value.formsWithAccess.includes(args.formId),
        )
        .map(async (membership) => {
          const user = await ctx.db.get(membership.userId);
          return {
            ...user,
            role: membership.role,
            formsWithAccess: membership.formsWithAccess,
            _id: membership.userId,
          };
        }),
    );

    return membersWithDetails;
  },
});

export const getOrganisationByHandle = query({
  args: { handle: v.string() },
  handler: async (ctx, args) => {
    const organisation = await ctx.db
      .query("organisations")
      .withIndex("handle", (q) => q.eq("handle", args.handle))
      .first();

    if (!organisation) return null;

    // Get stats, settings, and config
    const [stripeConfigDoc, viewsDoc, debugModeDoc] = await Promise.all([
      ctx.db
        .query("thirdPartyConfigs")
        .withIndex("by_organisation_provider", (q) =>
          q.eq("organisationId", organisation._id).eq("provider", "stripe")
        )
        .unique(),
      ctx.db
        .query("orgStats")
        .withIndex("by_organisation_metric", (q) =>
          q.eq("organisationId", organisation._id).eq("metric", "views")
        )
        .unique(),
      ctx.db
        .query("orgSettings")
        .withIndex("by_organisation_key", (q) =>
          q.eq("organisationId", organisation._id).eq("key", "debugMode")
        )
        .unique(),
    ]);

    // Redact secret key for the client
    const stripeConfig = stripeConfigDoc?.config ? {
      publishableKey: stripeConfigDoc.config.publishableKey,
    } : undefined;

    return {
      ...organisation,
      stripeConfig,
      views: viewsDoc?.value ?? 0,
      debugMode: !!debugModeDoc?.value,
      image: organisation.image
        ? await ctx.storage.getUrl(organisation.image)
        : undefined,
    };
  },
});

// Team Management Mutations

export const removeTeamMember = mutation({
  args: {
    organisationId: v.id("organisations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    // Only owner can remove team members
    if (organisation.owner !== currentUserId) {
      throw new Error("Only the owner can remove team members");
    }

    // Cannot remove the owner
    if (args.userId === organisation.owner) {
      throw new Error("Cannot remove the owner");
    }

    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", args.userId).eq("organisationId", args.organisationId),
      )
      .first();

    if (!membership) throw new Error("Membership not found");

    // Clear the user's selected organisation if it's the one they're being removed from
    const user = await ctx.db.get(args.userId);
    if (user?.selectedOrganisation === args.organisationId) {
      await ctx.db.patch(args.userId, { selectedOrganisation: undefined });
    }

    await ctx.db.delete(membership._id);
  },
});

export const updateTeamMemberRole = mutation({
  args: {
    organisationId: v.id("organisations"),
    userId: v.id("users"),
    role: v.union(v.literal("editor"), v.literal("viewer")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    // Only owner and editor can update roles
    const currentMembership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", currentUserId).eq("organisationId", args.organisationId),
      )
      .first();

    const isOwner = organisation.owner === currentUserId;
    const isEditor = currentMembership?.role === "editor";

    if (!isOwner && !isEditor) {
      throw new Error("Only owner or editor can update roles");
    }

    // Cannot change owner's role
    if (args.userId === organisation.owner) {
      throw new Error("Cannot change owner's role");
    }

    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", args.userId).eq("organisationId", args.organisationId),
      )
      .first();

    if (!membership) throw new Error("Membership not found");

    await ctx.db.patch(membership._id, {
      role: args.role,
    });
  },
});

export const getOrganisationMembersForService = query({
  args: {
    organisationId: v.id("organisations"),
    serviceId: v.string(),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) return [];

    const memberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .collect();

    const membersWithDetails = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        if (!user) return null;

        const isAssigned =
          membership.role === "owner" ||
          membership.role === "editor" ||
          membership.allowedServices === undefined ||
          membership.allowedServices.includes(args.serviceId);

        return {
          _id: membership.userId,
          membershipId: membership._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: membership.role,
          isAssigned,
          isRestricted: membership.allowedServices !== undefined,
        };
      }),
    );

    return membersWithDetails.filter(
      (m): m is NonNullable<typeof m> => m !== null,
    );
  },
});

export const toggleServiceUserAssignment = mutation({
  args: {
    organisationId: v.id("organisations"),
    serviceId: v.string(),
    userId: v.id("users"),
    isAssigned: v.boolean(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    // Only owner and editor can update service access
    const currentMembership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", currentUserId).eq("organisationId", args.organisationId),
      )
      .first();

    const isOwner = organisation.owner === currentUserId;
    const isEditor = currentMembership?.role === "editor";

    if (!isOwner && !isEditor) {
      throw new Error("Only owner or editor can update service access");
    }

    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", args.userId).eq("organisationId", args.organisationId),
      )
      .first();

    if (!membership) throw new Error("Membership not found");

    // Cannot restrict owner or editor
    if (membership.role === "owner" || membership.role === "editor") {
      throw new Error("Owners and editors always have access to all services");
    }

    let allowedServices = membership.allowedServices;

    // "By default all are assigned" logic:
    // If allowedServices is undefined, and we want to UNASSIGN (isAssigned=false),
    // we must first populate allowedServices with ALL current services EXCEPT the one being removed.
    if (allowedServices === undefined) {
      if (args.isAssigned) return; // Already assigned (All access)

      const form = await ctx.db.get(organisation.formId);
      const allServiceIds = form?.services.map((s) => s.id) || [];
      allowedServices = allServiceIds.filter((id) => id !== args.serviceId);
    } else {
      if (args.isAssigned) {
        if (!allowedServices.includes(args.serviceId)) {
          allowedServices = [...allowedServices, args.serviceId];
        }
      } else {
        allowedServices = allowedServices.filter((id) => id !== args.serviceId);
      }
    }

    await ctx.db.patch(membership._id, {
      allowedServices,
    });
  },
});

export const deactivateTeamMembersOnExpiry = mutation({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    // Get all members except owner
    const memberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .collect();

    // Deactivate all non-owner members
    await Promise.all(
      memberships
        .filter((m) => m.userId !== organisation.owner)
        .map((m) => ctx.db.patch(m._id, { status: "inactive" })),
    );
  },
});

export const reactivateTeamMembersOnRenewal = mutation({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    // Get all inactive members
    const memberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .collect();

    // Reactivate all inactive members
    await Promise.all(
      memberships
        .filter((m) => m.status === "inactive")
        .map((m) => ctx.db.patch(m._id, { status: "active" })),
    );
  },
});

export const checkUserAccess = query({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) return null;

    const isOwner = organisation.owner === userId;

    // Owner always has full access
    if (isOwner) {
      return {
        role: "owner" as const,
        status: "active" as const,
        canEditForm: true,
        canViewAllSubmissions: true,
        allowedServices: undefined,
        isActive: true,
      };
    }

    const membership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", args.organisationId),
      )
      .first();

    if (!membership) return null;

    // If subscription is expired, only owner has access
    if (organisation.subscriptionStatus !== "active" && !isOwner) {
      return {
        role: membership.role,
        status: "inactive" as const,
        canEditForm: false,
        canViewAllSubmissions: false,
        allowedServices: [],
        isActive: false,
      };
    }

    const canEditForm = membership.role === "editor";
    const canViewAllSubmissions =
      membership.role === "editor" || membership.role === "viewer";

    return {
      role: membership.role,
      status: membership.status,
      canEditForm,
      canViewAllSubmissions,
      allowedServices: membership.allowedServices, // This could be undefined (all) or string[] (restricted)
      isActive: membership.status === "active",
    };
  },
});

export const getOrganisationMembersForRouting = query({
  args: {
    organisationId: v.id("organisations"),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) return [];

    const memberships = await ctx.db
      .query("organisationMembers")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .collect();

    const membersWithDetails = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        if (!user) return null;

        return {
          _id: membership.userId,
          membershipId: membership._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: membership.role,
          allowedServices: membership.allowedServices, // undefined means ALL
          serviceEscalation: membership.serviceEscalation || {},
        };
      }),
    );

    return membersWithDetails.filter(
      (m): m is NonNullable<typeof m> => m !== null,
    );
  },
});

export const updateMemberEscalation = mutation({
  args: {
    membershipId: v.id("organisationMembers"),
    serviceEscalation: v.optional(v.any()),
    allowedServices: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const membership = await ctx.db.get(args.membershipId);
    if (!membership) throw new Error("Membership not found");

    const organisation = await ctx.db.get(membership.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    // Check if requester is owner or editor
    const requesterMembership = await ctx.db
      .query("organisationMembers")
      .withIndex("user_org_index", (q) =>
        q.eq("userId", userId).eq("organisationId", membership.organisationId),
      )
      .first();

    if (
      organisation.owner !== userId &&
      requesterMembership?.role !== "editor"
    ) {
      throw new Error("Only owners and editors can update routing settings");
    }

    const updates: any = {};
    if (args.serviceEscalation !== undefined)
      updates.serviceEscalation = args.serviceEscalation;
    if (args.allowedServices !== undefined) {
      // Allow restricting ANY role, including owner/editor if the UI allows it.
      // The user wants full control over inbox access per service.
      updates.allowedServices = args.allowedServices;
    }

    await ctx.db.patch(args.membershipId, updates);
  },
});

export const toggleDebugMode = mutation({
  args: {
    organisationId: v.id("organisations"),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    if (organisation.owner !== userId) {
      throw new Error("Only the owner can toggle debug mode.");
    }

    const existing = await ctx.db
      .query("orgSettings")
      .withIndex("by_organisation_key", (q) =>
        q.eq("organisationId", args.organisationId).eq("key", "debugMode")
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.enabled,
      });
    } else {
      await ctx.db.insert("orgSettings", {
        organisationId: args.organisationId,
        key: "debugMode",
        value: args.enabled,
      });
    }
  },
});

export const fakeUpdatePlan = mutation({
  args: {
    organisationId: v.id("organisations"),
    plan: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    if (organisation.owner !== userId) {
      throw new Error("Only the owner can update the plan.");
    }

    const debugModeDoc = await ctx.db
      .query("orgSettings")
      .withIndex("by_organisation_key", (q) =>
        q.eq("organisationId", args.organisationId).eq("key", "debugMode")
      )
      .unique();

    if (!debugModeDoc?.value) {
      throw new Error("Debug mode must be enabled to fake plan updates.");
    }

    await ctx.db.patch(args.organisationId, {
      plan: args.plan,
      subscriptionStatus: args.status,
    });

    // Also upsert a fake subscription record if needed
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_organisation", (q) =>
        q.eq("organisationId", args.organisationId),
      )
      .first();

    const fakeSubData = {
      organisationId: args.organisationId,
      lemonSqueezyId: `fake_${Date.now()}`,
      lemonSqueezyCustomerId: "fake_customer",
      productId: "fake_product",
      variantId: "fake_variant",
      status: args.status,
      planId: args.plan,
      currentPeriodStart: Date.now(),
      currentPeriodEnd: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    if (existing) {
      await ctx.db.patch(existing._id, fakeSubData);
    } else {
      await ctx.db.insert("subscriptions", fakeSubData);
    }
  },
});
export const updateOrganisationStripeConfig = mutation({
  args: {
    organisationId: v.id("organisations"),
    stripeConfig: v.object({
      publishableKey: v.string(),
      secretKey: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) throw new Error("Organisation not found");

    if (organisation.owner !== userId) {
      throw new Error("Only the owner can update the Stripe configuration.");
    }

    // Get existing config
    const existingConfigDoc = await ctx.db
      .query("thirdPartyConfigs")
      .withIndex("by_organisation_provider", (q) =>
        q.eq("organisationId", args.organisationId).eq("provider", "stripe")
      )
      .unique();

    const finalSecretKey = args.stripeConfig.secretKey || existingConfigDoc?.config?.secretKey || "";

    const newConfig = {
      publishableKey: args.stripeConfig.publishableKey,
      secretKey: finalSecretKey,
    };

    if (existingConfigDoc) {
      await ctx.db.patch(existingConfigDoc._id, {
        config: newConfig,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("thirdPartyConfigs", {
        organisationId: args.organisationId,
        provider: "stripe",
        config: newConfig,
        updatedAt: Date.now(),
      });
    }

    return true;
  },
});
