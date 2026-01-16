/**
 * Subscription Utility Functions
 * 
 * Helper functions for working with subscriptions, pricing, and dates.
 */

import { SubscriptionStatus, SubscriptionPlan } from '../types/subscription-types';
import { PLAN_CONFIGS } from '../config/plan-config';

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Calculate proration amount when changing plans
 */
export function calculateProration(
    currentPlan: SubscriptionPlan,
    newPlan: SubscriptionPlan,
    daysRemaining: number
): number {
    const currentMonthly = PLAN_CONFIGS[currentPlan].pricing.monthly;
    const newMonthly = PLAN_CONFIGS[newPlan].pricing.monthly;

    const dailyDifference = (newMonthly - currentMonthly) / 30;
    return Math.max(0, dailyDifference * daysRemaining);
}

/**
 * Get next billing date from subscription
 */
export function getNextBillingDate(subscription: {
    renewsAt?: number;
    endsAt?: number;
    status: string;
}): Date | null {
    if (subscription.status === 'cancelled' && subscription.endsAt) {
        return new Date(subscription.endsAt);
    }

    if (subscription.renewsAt) {
        return new Date(subscription.renewsAt);
    }

    return null;
}

/**
 * Check if subscription is in an active state
 */
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
    return ['on_trial', 'active', 'past_due'].includes(status);
}

/**
 * Check if subscription is in grace period (cancelled but still active)
 */
export function isInGracePeriod(subscription: {
    status: string;
    endsAt?: number;
}): boolean {
    if (subscription.status !== 'cancelled') return false;
    if (!subscription.endsAt) return false;

    return Date.now() < subscription.endsAt;
}

/**
 * Get plan badge text
 */
export function getPlanBadge(planId: SubscriptionPlan): string | undefined {
    return PLAN_CONFIGS[planId].ui.badge;
}

/**
 * Get plan color
 */
export function getPlanColor(planId: SubscriptionPlan): string | undefined {
    return PLAN_CONFIGS[planId].ui.color;
}

/**
 * Format storage size for display
 */
export function formatStorageSize(mb: number): string {
    if (mb < 1024) {
        return `${Math.round(mb)}MB`;
    }

    const gb = mb / 1024;
    return `${gb.toFixed(1)}GB`;
}

/**
 * Calculate percentage usage
 */
export function calculateUsagePercentage(current: number, limit: number): number {
    if (limit === Infinity || limit === 0) return 0;
    return Math.min(100, Math.round((current / limit) * 100));
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: SubscriptionStatus): string {
    switch (status) {
        case 'active':
        case 'on_trial':
            return 'green';
        case 'past_due':
            return 'yellow';
        case 'cancelled':
            return 'orange';
        case 'expired':
        case 'unpaid':
            return 'red';
        case 'paused':
            return 'gray';
        default:
            return 'gray';
    }
}

/**
 * Get human-readable status text
 */
export function getStatusText(status: SubscriptionStatus): string {
    switch (status) {
        case 'on_trial':
            return 'On Trial';
        case 'active':
            return 'Active';
        case 'paused':
            return 'Paused';
        case 'past_due':
            return 'Past Due';
        case 'unpaid':
            return 'Unpaid';
        case 'cancelled':
            return 'Cancelled';
        case 'expired':
            return 'Expired';
        default:
            return status;
    }
}

/**
 * Calculate days remaining in billing period
 */
export function getDaysRemaining(endDate: number): number {
    const now = Date.now();
    const diff = endDate - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Check if usage is approaching limit (>= 80%)
 */
export function isApproachingLimit(current: number, limit: number): boolean {
    if (limit === Infinity) return false;
    return current >= limit * 0.8;
}

/**
 * Check if usage has exceeded limit
 */
export function hasExceededLimit(current: number, limit: number): boolean {
    if (limit === Infinity) return false;
    return current >= limit;
}
