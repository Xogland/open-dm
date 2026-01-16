import { v } from "convex/values";
import { action } from "./_generated/server";
import Stripe from "stripe";

export const createPaymentIntent = action({
    args: {
        organisationId: v.id("organisations"),
        formId: v.id("forms"),
        amount: v.number(),
        currency: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // 1. Get the organisation
        // Use string-based query to avoid circular dependency which causes TS7022
        const organisation = await ctx.runQuery(
            "organisation:getOrganisationInternal" as any,
            { id: args.organisationId }
        );

        if (!organisation) {
            throw new Error("Organisation not found");
        }

        if (!organisation.stripeConfig || !organisation.stripeConfig.secretKey) {
            throw new Error("Stripe is not configured for this organisation");
        }

        const stripe = new Stripe(organisation.stripeConfig.secretKey, {
            apiVersion: "2025-01-27.acacia" as any, // Use latest or stable
        });

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(args.amount * 100), // Stripe expects cents
                currency: args.currency.toLowerCase(),
                description: args.description,
                metadata: {
                    organisationId: args.organisationId,
                    formId: args.formId,
                },
            });

            return {
                clientSecret: paymentIntent.client_secret,
            };
        } catch (error: any) {
            console.error("Stripe error:", error);
            throw new Error(error.message);
        }
    },
});
