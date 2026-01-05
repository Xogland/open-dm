/**
 * Subscription Service Layer
 * 
 * Business logic for subscription operations.
 * This layer sits between the UI and the API/database layers.
 */

import { getLemonSqueezyClient } from './lemon-squeezy-client';
import {
    SubscriptionPlan,
    BillingCycle,
    ActionValidationResult,
    SubscriptionAction
} from '../types/subscription-types';
import { getPlanConfig, isAdvancedWorkflowType } from '../config/plan-config';
import { Id } from '@/convex/_generated/dataModel';

/**
 * Initiate checkout for a subscription plan
 */
export async function initiateCheckout(
    organisationId: Id<"organisations">,
    planId: SubscriptionPlan,
    billingCycle: BillingCycle,
    userId?: string
): Promise<string> {
    const client = getLemonSqueezyClient();

    const checkoutUrl = await client.createCheckout(
        planId,
        billingCycle,
        {
            organisation_id: organisationId,
            user_id: userId,
        }
    );

    return checkoutUrl;
}

/**
 * Upgrade subscription plan
 */
export async function upgradePlan(
    subscriptionId: string,
    newPlan: SubscriptionPlan,
    billingCycle: BillingCycle
): Promise<void> {
    const client = getLemonSqueezyClient();
    await client.changePlan(subscriptionId, newPlan, billingCycle);
}

/**
 * Downgrade subscription plan
 */
export async function downgradePlan(
    subscriptionId: string,
    newPlan: SubscriptionPlan,
    billingCycle: BillingCycle
): Promise<void> {
    const client = getLemonSqueezyClient();
    await client.changePlan(subscriptionId, newPlan, billingCycle);
}

/**
 * Cancel subscription (enters grace period)
 */
export async function cancelSubscription(subscriptionId: string): Promise<void> {
    const client = getLemonSqueezyClient();
    await client.cancelSubscription(subscriptionId);
}

/**
 * Reactivate cancelled subscription
 */
export async function reactivateSubscription(subscriptionId: string): Promise<void> {
    const client = getLemonSqueezyClient();
    await client.resumeSubscription(subscriptionId);
}

/**
 * Pause subscription
 */
export async function pauseSubscription(
    subscriptionId: string,
    mode: 'void' | 'free' = 'void'
): Promise<void> {
    const client = getLemonSqueezyClient();
    await client.pauseSubscription(subscriptionId, mode);
}

/**
 * Unpause subscription
 */
export async function unpauseSubscription(subscriptionId: string): Promise<void> {
    const client = getLemonSqueezyClient();
    await client.unpauseSubscription(subscriptionId);
}

/**
 * Calculate usage statistics with percentages
 */
export function calculateUsageStats(
    usage: {
        services: number;
        submissions: number;
        teamMembers: number;
        storageMB: number;
    },
    planId: SubscriptionPlan
) {
    const config = getPlanConfig(planId);

    return {
        services: {
            current: usage.services,
            limit: config.limits.servicesLimit,
            percentage: calculatePercentage(usage.services, config.limits.servicesLimit),
        },
        submissions: {
            current: usage.submissions,
            limit: config.limits.submissionsPerMonth,
            percentage: calculatePercentage(usage.submissions, config.limits.submissionsPerMonth),
        },
        storage: {
            currentMB: usage.storageMB,
            limitMB: config.limits.storageLimit,
            percentage: calculatePercentage(usage.storageMB, config.limits.storageLimit),
        },
        teamMembers: {
            current: usage.teamMembers,
            limit: config.limits.teamMembersLimit,
            percentage: calculatePercentage(usage.teamMembers, config.limits.teamMembersLimit),
        },
    };
}

/**
 * Validate if an action is allowed under current plan
 */
export function validateAction(
    action: SubscriptionAction,
    planId: SubscriptionPlan,
    currentUsage: {
        services: number;
        teamMembers: number;
        storageMB: number;
    },
    metadata?: {
        fileSize?: number;
        workflowType?: string;
    }
): ActionValidationResult {
    const config = getPlanConfig(planId);

    switch (action) {
        case 'add_service':
            if (currentUsage.services >= config.limits.servicesLimit) {
                return {
                    allowed: false,
                    reason: `Service limit reached (${config.limits.servicesLimit})`,
                    currentUsage: currentUsage.services,
                    limit: config.limits.servicesLimit,
                    upgradeRequired: 'professional',
                };
            }
            return { allowed: true };

        case 'add_team_member':
            if (currentUsage.teamMembers >= config.limits.teamMembersLimit) {
                return {
                    allowed: false,
                    reason: `Team member limit reached (${config.limits.teamMembersLimit})`,
                    currentUsage: currentUsage.teamMembers,
                    limit: config.limits.teamMembersLimit,
                    upgradeRequired: 'professional',
                };
            }
            return { allowed: true };

        case 'upload_file':
            const fileSize = metadata?.fileSize || 0;
            const fileSizeMB = fileSize / (1024 * 1024);
            const newTotal = currentUsage.storageMB + fileSizeMB;

            if (newTotal > config.limits.storageLimit) {
                return {
                    allowed: false,
                    reason: `Storage limit would be exceeded (${config.limits.storageLimit}MB)`,
                    currentUsage: currentUsage.storageMB,
                    limit: config.limits.storageLimit,
                    upgradeRequired: 'professional',
                };
            }
            return { allowed: true };

        case 'use_advanced_workflow':
            const workflowType = metadata?.workflowType || '';
            if (isAdvancedWorkflowType(workflowType) && !config.features.advancedWorkflows) {
                return {
                    allowed: false,
                    reason: 'Advanced workflows require Professional plan',
                    upgradeRequired: 'professional',
                };
            }
            return { allowed: true };

        case 'access_api':
            if (!config.features.apiAccess) {
                return {
                    allowed: false,
                    reason: 'API access requires Professional plan',
                    upgradeRequired: 'professional',
                };
            }
            return { allowed: true };

        case 'use_custom_branding':
            if (!config.features.customBranding) {
                return {
                    allowed: false,
                    reason: 'Custom branding requires Professional plan',
                    upgradeRequired: 'professional',
                };
            }
            return { allowed: true };

        case 'use_custom_domain':
            if (!config.features.customDomain) {
                return {
                    allowed: false,
                    reason: 'Custom domain requires Professional plan',
                    upgradeRequired: 'professional',
                };
            }
            return { allowed: true };

        case 'export_data':
            if (!config.features.exportData) {
                return {
                    allowed: false,
                    reason: 'Data export requires Professional plan',
                    upgradeRequired: 'professional',
                };
            }
            return { allowed: true };

        case 'use_webhooks':
            if (!config.features.webhooks) {
                return {
                    allowed: false,
                    reason: 'Webhooks require Professional plan',
                    upgradeRequired: 'professional',
                };
            }
            return { allowed: true };

        default:
            return { allowed: true };
    }
}

/**
 * Helper: Calculate usage percentage
 */
function calculatePercentage(current: number, limit: number): number {
    if (limit === Infinity || limit === 0) return 0;
    return Math.min(100, Math.round((current / limit) * 100));
}
