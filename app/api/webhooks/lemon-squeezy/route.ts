/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Lemon Squeezy Webhook Handler
 * 
 * Next.js API route that receives and processes webhooks from Lemon Squeezy.
 * Handles subscription lifecycle events and syncs data to Convex database.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import {
    validateWebhookSignature,
    parseWebhookEvent,
    getOrganisationIdFromWebhook,
} from '@/features/subscription/services/webhook-validator';
import { getLemonSqueezyConfig } from '@/features/subscription/config/env-config';
import { Id } from '@/convex/_generated/dataModel';

// Initialize Convex client for server-side mutations
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * POST handler for Lemon Squeezy webhooks
 */
export async function POST(request: NextRequest) {
    try {
        // Get raw body for signature validation
        const rawBody = await request.text();
        const signature = request.headers.get('x-signature');

        if (!signature) {
            console.error('Missing X-Signature header');
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 401 }
            );
        }

        // Validate webhook signature
        const config = getLemonSqueezyConfig();
        const isValid = validateWebhookSignature(rawBody, signature, config.webhookSecret);

        if (!isValid) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        // Parse webhook event
        const event = parseWebhookEvent(rawBody);
        const eventType = event.meta.event_name;

        console.log(`[Webhook] Received event: ${eventType}`);

        // Get organisation ID from custom data
        const organisationId = getOrganisationIdFromWebhook(event);

        if (!organisationId) {
            console.error('Missing organisation_id in webhook custom data');
            return NextResponse.json(
                { error: 'Missing organisation_id' },
                { status: 400 }
            );
        }

        // Route to appropriate handler based on event type
        switch (eventType) {
            case 'subscription_created':
                await handleSubscriptionCreated(event, organisationId);
                break;

            case 'subscription_updated':
                await handleSubscriptionUpdated(event);
                break;

            case 'subscription_cancelled':
                await handleSubscriptionCancelled(event);
                break;

            case 'subscription_resumed':
                await handleSubscriptionResumed(event);
                break;

            case 'subscription_expired':
                await handleSubscriptionExpired(event);
                break;

            case 'subscription_paused':
            case 'subscription_unpaused':
                await handleSubscriptionPauseChange(event);
                break;

            case 'subscription_payment_success':
                await handlePaymentSuccess(event);
                break;

            case 'subscription_payment_failed':
                await handlePaymentFailed(event);
                break;

            case 'subscription_payment_recovered':
                await handlePaymentRecovered(event);
                break;

            default:
                console.log(`[Webhook] Unhandled event type: ${eventType}`);
        }

        // Return 200 to acknowledge receipt
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error('[Webhook] Error processing webhook:', error);

        // Still return 200 to prevent Lemon Squeezy from retrying
        // Log the error for manual investigation
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 200 }
        );
    }
}

/**
 * Handle subscription_created event
 */
async function handleSubscriptionCreated(event: any, organisationId: string) {
    const subscription = event.data.attributes;

    // Determine plan ID from variant or product name
    const planId = determinePlanId(subscription.variant_name);

    await convex.mutation((api as any)["subscription-mutations"].upsertSubscription, {
        organisationId: organisationId as Id<"organisations">,
        lemonSqueezyId: event.data.id,
        lemonSqueezyCustomerId: subscription.customer_id.toString(),
        productId: subscription.product_id.toString(),
        variantId: subscription.variant_id.toString(),
        status: subscription.status,
        planId,
        currentPeriodStart: new Date(subscription.created_at).getTime(),
        currentPeriodEnd: new Date(subscription.renews_at || subscription.ends_at).getTime(),
        trialEndsAt: subscription.trial_ends_at ? new Date(subscription.trial_ends_at).getTime() : undefined,
        renewsAt: subscription.renews_at ? new Date(subscription.renews_at).getTime() : undefined,
        endsAt: subscription.ends_at ? new Date(subscription.ends_at).getTime() : undefined,
        cardBrand: subscription.card_brand,
        cardLastFour: subscription.card_last_four,
        updatePaymentMethodUrl: subscription.urls.update_payment_method,
        customerPortalUrl: subscription.urls.customer_portal,
    });

    console.log(`[Webhook] Created subscription for organisation: ${organisationId}`);
}

/**
 * Handle subscription_updated event
 */
async function handleSubscriptionUpdated(event: any) {
    const subscription = event.data.attributes;
    const planId = determinePlanId(subscription.variant_name);

    await convex.mutation((api as any)["subscription-mutations"].upsertSubscription, {
        organisationId: event.meta.custom_data.organisation_id as Id<"organisations">,
        lemonSqueezyId: event.data.id,
        lemonSqueezyCustomerId: subscription.customer_id.toString(),
        productId: subscription.product_id.toString(),
        variantId: subscription.variant_id.toString(),
        status: subscription.status,
        planId,
        currentPeriodStart: new Date(subscription.created_at).getTime(),
        currentPeriodEnd: new Date(subscription.renews_at || subscription.ends_at).getTime(),
        trialEndsAt: subscription.trial_ends_at ? new Date(subscription.trial_ends_at).getTime() : undefined,
        renewsAt: subscription.renews_at ? new Date(subscription.renews_at).getTime() : undefined,
        endsAt: subscription.ends_at ? new Date(subscription.ends_at).getTime() : undefined,
        cardBrand: subscription.card_brand,
        cardLastFour: subscription.card_last_four,
        updatePaymentMethodUrl: subscription.urls.update_payment_method,
        customerPortalUrl: subscription.urls.customer_portal,
    });

    console.log(`[Webhook] Updated subscription: ${event.data.id}`);
}

/**
 * Handle subscription_cancelled event
 */
async function handleSubscriptionCancelled(event: any) {
    const subscription = event.data.attributes;

    await convex.mutation((api as any)["subscription-mutations"].updateSubscriptionStatus, {
        lemonSqueezyId: event.data.id,
        status: 'cancelled',
        endsAt: subscription.ends_at ? new Date(subscription.ends_at).getTime() : undefined,
    });

    console.log(`[Webhook] Cancelled subscription: ${event.data.id}`);
}

/**
 * Handle subscription_resumed event
 */
async function handleSubscriptionResumed(event: any) {
    const subscription = event.data.attributes;

    await convex.mutation((api as any)["subscription-mutations"].updateSubscriptionStatus, {
        lemonSqueezyId: event.data.id,
        status: 'active',
        renewsAt: subscription.renews_at ? new Date(subscription.renews_at).getTime() : undefined,
        endsAt: undefined,
    });

    console.log(`[Webhook] Resumed subscription: ${event.data.id}`);
}

/**
 * Handle subscription_expired event
 */
async function handleSubscriptionExpired(event: any) {
    const subscription = event.data.attributes;

    await convex.mutation((api as any)["subscription-mutations"].updateSubscriptionStatus, {
        lemonSqueezyId: event.data.id,
        status: 'expired',
        endsAt: subscription.ends_at ? new Date(subscription.ends_at).getTime() : undefined,
    });

    console.log(`[Webhook] Expired subscription: ${event.data.id}`);
}

/**
 * Handle subscription pause/unpause events
 */
async function handleSubscriptionPauseChange(event: any) {
    const subscription = event.data.attributes;

    await convex.mutation((api as any)["subscription-mutations"].updateSubscriptionStatus, {
        lemonSqueezyId: event.data.id,
        status: subscription.status,
        renewsAt: subscription.renews_at ? new Date(subscription.renews_at).getTime() : undefined,
    });

    console.log(`[Webhook] Pause status changed for subscription: ${event.data.id}`);
}

/**
 * Handle payment_success event
 */
async function handlePaymentSuccess(event: any) {
    const subscription = event.data.attributes;

    await convex.mutation((api as any)["subscription-mutations"].updateSubscriptionStatus, {
        lemonSqueezyId: event.data.id,
        status: 'active',
        renewsAt: subscription.renews_at ? new Date(subscription.renews_at).getTime() : undefined,
    });

    console.log(`[Webhook] Payment succeeded for subscription: ${event.data.id}`);
}

/**
 * Handle payment_failed event
 */
async function handlePaymentFailed(event: any) {
    await convex.mutation((api as any)["subscription-mutations"].updateSubscriptionStatus, {
        lemonSqueezyId: event.data.id,
        status: 'past_due',
    });

    console.log(`[Webhook] Payment failed for subscription: ${event.data.id}`);
}

/**
 * Handle payment_recovered event
 */
async function handlePaymentRecovered(event: any) {
    const subscription = event.data.attributes;

    await convex.mutation((api as any)["subscription-mutations"].updateSubscriptionStatus, {
        lemonSqueezyId: event.data.id,
        status: 'active',
        renewsAt: subscription.renews_at ? new Date(subscription.renews_at).getTime() : undefined,
    });

    console.log(`[Webhook] Payment recovered for subscription: ${event.data.id}`);
}

/**
 * Determine plan ID from variant name
 * This maps Lemon Squeezy variant names to our internal plan IDs
 */
function determinePlanId(variantName: string): string {
    const lowerName = variantName.toLowerCase();

    if (lowerName.includes('starter')) return 'starter';
    if (lowerName.includes('professional') || lowerName.includes('pro')) return 'professional';
    if (lowerName.includes('enterprise')) return 'enterprise';

    // Default to starter if we can't determine
    console.warn(`Could not determine plan ID from variant name: ${variantName}`);
    return 'starter';
}
