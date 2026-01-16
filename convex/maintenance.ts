import { internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const clearReservedHandles = internalMutation({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("reservedHandles").collect();
        for (const doc of all) {
            await ctx.db.delete(doc._id);
        }
        return all.length;
    },
});

/**
 * CAUTION: This will wipe almost all data in the database.
 * Preserves:
 * - reservedHandles
 * - redemptionKeys
 */
export const wipeAllData = internalMutation({
    args: {},
    handler: async (ctx) => {
        const tablesToClear = [
            "forms",
            "submissions",
            "connections",
            "attachments",
            "subscriptions",
            "teamInvites",
            "referrals",
            "preregistered",
            "acquiredHandles",
            "organisationMembers",
            "organisations",
            "users",
            "sessions",
            "accounts",
            "verificationTokens",
            "orgSettings",
            "orgStats",
            "thirdPartyConfigs",
        ] as const;

        const stats: Record<string, number> = {};

        for (const table of tablesToClear) {
            try {
                // We use try-catch because some tables might not exist or be accessible depending on the schema state
                const all = await ctx.db.query(table as any).collect();
                stats[table] = all.length;

                for (const doc of all) {
                    // special handling for attachments to delete from storage
                    if (table === "attachments" && (doc as any).storageId) {
                        try {
                            await ctx.storage.delete((doc as any).storageId as Id<"_storage">);
                        } catch (e) {
                            console.error(`Failed to delete storage for attachment ${doc._id}:`, e);
                        }
                    }

                    // special handling for organisations to delete images
                    if (table === "organisations" && (doc as any).image) {
                        try {
                            await ctx.storage.delete((doc as any).image as Id<"_storage">);
                        } catch (e) {
                            console.error(`Failed to delete storage for organisation image ${doc._id}:`, e);
                        }
                    }

                    await ctx.db.delete(doc._id);
                }
            } catch (error) {
                console.warn(`Could not clear table ${table}:`, error);
                stats[table] = -1; // Indicate error
            }
        }

        return {
            message: "Data wipe completed",
            stats,
            preserved: ["reservedHandles", "redemptionKeys"]
        };
    },
});
