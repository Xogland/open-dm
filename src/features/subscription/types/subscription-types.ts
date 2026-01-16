/**
 * Subscription Domain Types
 * 
 * Type-safe definitions for the subscription payment system using Lemon Squeezy.
 * These types form the core of the subscription domain in our clean architecture.
 */

import { Id } from "@/convex/_generated/dataModel";
import { SubscriptionPlan, PlanConfig } from "@/convex/planLimitConfig";

export type { SubscriptionPlan, PlanConfig };


// ============================================================================
// Plan Types
// ============================================================================

/**
 * Subscription status matching Lemon Squeezy API
 * @see https://docs.lemonsqueezy.com/api/subscriptions#status
 */
export type SubscriptionStatus =
    | 'on_trial'      // In trial period before first payment
    | 'active'        // Current and valid
    | 'paused'        // Payment collection paused
    | 'past_due'      // Renewal payment failed, retrying
    | 'unpaid'        // All payment retries failed
    | 'cancelled'     // Cancelled but still in grace period
    | 'expired';      // Subscription has ended

/**
 * Billing cycle options
 */
export type BillingCycle = 'monthly' | 'annual';

// ============================================================================
// Plan Configuration
// ============================================================================


// Interface is now imported from @/convex/planLimitConfig


// ============================================================================
// Lemon Squeezy API Types
// ============================================================================

/**
 * Lemon Squeezy subscription object
 * Matches the API response structure
 */
export interface LemonSqueezySubscription {
    id: string;
    type: 'subscriptions';
    attributes: {
        store_id: number;
        customer_id: number;
        order_id: number;
        order_item_id: number;
        product_id: number;
        variant_id: number;
        product_name: string;
        variant_name: string;
        user_name: string;
        user_email: string;
        status: SubscriptionStatus;
        status_formatted: string;
        card_brand?: string;
        card_last_four?: string;
        pause: null | {
            mode: string;
            resumes_at: string;
        };
        cancelled: boolean;
        trial_ends_at: string | null;
        billing_anchor: number;
        urls: {
            update_payment_method: string;
            customer_portal: string;
        };
        renews_at: string | null;
        ends_at: string | null;
        created_at: string;
        updated_at: string;
        test_mode: boolean;
    };
}

/**
 * Webhook event types from Lemon Squeezy
 */
export type WebhookEventType =
    | 'subscription_created'
    | 'subscription_updated'
    | 'subscription_cancelled'
    | 'subscription_resumed'
    | 'subscription_expired'
    | 'subscription_paused'
    | 'subscription_unpaused'
    | 'subscription_payment_success'
    | 'subscription_payment_failed'
    | 'subscription_payment_recovered'
    | 'order_created'
    | 'order_refunded';

/**
 * Webhook event payload structure
 */
export interface WebhookEvent {
    meta: {
        event_name: WebhookEventType;
        custom_data?: {
            organisation_id?: string;
            user_id?: string;
        };
    };
    data: LemonSqueezySubscription;
}

// ============================================================================
// Database Types
// ============================================================================

/**
 * Subscription metadata stored in Convex database
 */
export interface SubscriptionMetadata {
    _id: Id<"subscriptions">;
    _creationTime: number;
    organisationId: Id<"organisations">;
    lemonSqueezyId: string;
    lemonSqueezyCustomerId: string;
    productId: string;
    variantId: string;
    status: SubscriptionStatus;
    planId: SubscriptionPlan;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    trialEndsAt?: number;
    renewsAt?: number;
    endsAt?: number;
    cardBrand?: string;
    cardLastFour?: string;
    updatePaymentMethodUrl?: string;
    customerPortalUrl?: string;
}

/**
 * Usage statistics for an organisation
 */
export interface UsageStats {
    services: {
        current: number;
        limit: number;
        percentage: number;
    };
    submissions: {
        currentMonth: number;
        limit: number;
        percentage: number;
    };
    storage: {
        currentMB: number;
        limitMB: number;
        percentage: number;
    };
    teamMembers: {
        current: number;
        limit: number;
        percentage: number;
    };
}

/**
 * Action types that can be validated against plan limits
 */
export type SubscriptionAction =
    | 'add_service'
    | 'add_team_member'
    | 'upload_file'
    | 'use_advanced_workflow'
    | 'access_api'
    | 'use_custom_branding'
    | 'use_custom_domain'
    | 'export_data'
    | 'use_webhooks';

/**
 * Metadata for action validation
 */
export interface ActionMetadata {
    action: SubscriptionAction;
    metadata?: {
        fileSize?: number;        // For upload_file
        workflowType?: string;    // For use_advanced_workflow
    };
}

/**
 * Result of action validation
 */
export interface ActionValidationResult {
    allowed: boolean;
    reason?: string;
    currentUsage?: number;
    limit?: number;
    upgradeRequired?: SubscriptionPlan;
    limitType?: 'submissions' | 'services' | 'storage' | 'teamMembers' | 'organisations';
}
