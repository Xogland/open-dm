import { internalMutation } from "./_generated/server";

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
