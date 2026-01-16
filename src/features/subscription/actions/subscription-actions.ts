'use server';

/**
 * Subscription Server Actions
 * 
 * Handles server-side operations for subscription management,
 * specifically interacting with the Lemon Squeezy API.
 */

import { getLemonSqueezyClient } from '../services/lemon-squeezy-client';
import { revalidatePath } from 'next/cache';
import { initiateCheckout } from '../services/subscription-service';
import { BillingCycle, SubscriptionPlan } from '../types/subscription-types';
import { Id } from '@/convex/_generated/dataModel';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { env } from '@/env';

/**
 * Cancel a subscription in Lemon Squeezy
 * 
 * @param subscriptionId - The Lemon Squeezy subscription ID (numerical or string)
 */
export async function cancelSubscriptionAction(subscriptionId: string) {
    if (!subscriptionId) {
        return { success: false, error: 'Subscription ID is required' };
    }

    try {
        const client = getLemonSqueezyClient();
        await client.cancelSubscription(subscriptionId);

        // Revalidate the billing page if it's cached
        revalidatePath('/dashboard/billing');

        return { success: true };
    } catch (error: any) {
        console.error('[Action] Error cancelling subscription:', error);
        return {
            success: false,
            error: error.message || 'Failed to cancel subscription'
        };
    }
}

/**
 * Update a subscription plan (upgrade/downgrade with proration)
 * 
 * @param subscriptionId - The LS subscription ID
 * @param newPlan - The target plan ID
 * @param billingCycle - The target billing cycle
 */
export async function updateSubscriptionAction(
    subscriptionId: string,
    newPlan: any,
    billingCycle: any
) {
    if (!subscriptionId) {
        return { success: false, error: 'Subscription ID is required' };
    }

    try {
        const client = getLemonSqueezyClient();
        await client.changePlan(subscriptionId, newPlan, billingCycle);

        // Revalidate to update data from webhooks
        revalidatePath('/dashboard/billing');

        return { success: true };
    } catch (error: any) {
        console.error('[Action] Error updating subscription:', error);
        return {
            success: false,
            error: error.message || 'Failed to update plan'
        };
    }
}

/**
 * Create a checkout session in Lemon Squeezy
 */
export async function createCheckoutAction(
    organisationId: Id<"organisations">,
    planId: SubscriptionPlan,
    billingCycle: BillingCycle,
    userId?: string
) {
    try {
        // Check for discount eligibility
        let discountCode: string | undefined = undefined;
        try {
            const eligibility = await fetchQuery(api.preregistration.checkDiscountEligibility);
            if (eligibility.eligible && env.LEMON_SQUEEZY_PREREGISTERED_DISCOUNT_CODE) {
                discountCode = env.LEMON_SQUEEZY_PREREGISTERED_DISCOUNT_CODE;
                console.log(`[Action] Applying preregistration discount: ${discountCode}`);
            }
        } catch (eligibilityError) {
            console.error('[Action] Error checking discount eligibility:', eligibilityError);
            // Continue without discount if check fails
        }

        const checkoutUrl = await initiateCheckout(
            organisationId,
            planId,
            billingCycle,
            userId,
            discountCode
        );

        return { success: true, url: checkoutUrl };
    } catch (error: any) {
        console.error('[Action] Error creating checkout:', error);
        return {
            success: false,
            error: error.message || 'Failed to initiate checkout'
        };
    }
}