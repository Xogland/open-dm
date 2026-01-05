/**
 * Subscription Plan Configuration
 * 
 * Centralized configuration for all subscription plans.
 * This is the single source of truth for plan limits, features, and pricing.
 */

import { PlanConfig, SubscriptionPlan } from '../types/subscription-types';

/**
 * All available subscription plans with their configurations
 */
export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanConfig> = {
    starter: {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for individuals and small projects getting started',

        pricing: {
            monthly: 0,
            annual: 0,
            currency: 'USD',
        },

        limits: {
            servicesLimit: 3,
            submissionsPerMonth: Infinity,
            storageLimit: 1024, // 1GB in MB
            teamMembersLimit: 0,
            analyticsRetention: 30,
        },

        features: {
            customBranding: false,
            prioritySupport: false,
            apiAccess: false,
            advancedWorkflows: false,
            customDomain: false,
            exportData: false,
            webhooks: false,
            analytics: false,
        },

        ui: {
            badge: 'Free',
            popular: false,
            color: '#6B7280',
        },
    },

    professional: {
        id: 'professional',
        name: 'Professional',
        description: 'For growing teams that need advanced features and customization',

        pricing: {
            monthly: 29,
            annual: 290, // ~$24/month when billed annually
            currency: 'USD',
        },

        limits: {
            servicesLimit: 10,
            submissionsPerMonth: Infinity,
            storageLimit: 10240, // 10GB in MB
            teamMembersLimit: 5,
            analyticsRetention: 90,
        },

        features: {
            customBranding: true,
            prioritySupport: true,
            apiAccess: true,
            advancedWorkflows: true,
            customDomain: true,
            exportData: true,
            webhooks: true,
            analytics: true,
        },

        ui: {
            badge: 'Most Popular',
            popular: true,
            color: '#3B82F6',
        },
    },

    enterprise: {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Unlimited everything for large organizations with complex needs',

        pricing: {
            monthly: 99,
            annual: 990, // ~$82.50/month when billed annually
            currency: 'USD',
        },

        limits: {
            servicesLimit: Infinity,
            submissionsPerMonth: Infinity,
            storageLimit: 102400, // 100GB in MB
            teamMembersLimit: Infinity,
            analyticsRetention: 365,
        },

        features: {
            customBranding: true,
            prioritySupport: true,
            apiAccess: true,
            advancedWorkflows: true,
            customDomain: true,
            exportData: true,
            webhooks: true,
            analytics: true,
        },

        ui: {
            badge: 'Best Value',
            popular: false,
            color: '#8B5CF6',
        },
    },
};

/**
 * Legacy plan mapping for backward compatibility
 */
const PLAN_MAPPING: Record<string, SubscriptionPlan> = {
    'free': 'starter',
    'pro': 'professional',
    'business': 'enterprise',
    'starter': 'starter',
    'professional': 'professional',
    'enterprise': 'enterprise',
};

/**
 * Get plan configuration by ID
 */
export function getPlanConfig(planId: SubscriptionPlan | string): PlanConfig {
    const normalizedId = PLAN_MAPPING[planId] || 'starter'; // Default to starter if unknown
    return PLAN_CONFIGS[normalizedId];
}

/**
 * Get all plans as an array (useful for displaying pricing tables)
 */
export function getAllPlans(): PlanConfig[] {
    return Object.values(PLAN_CONFIGS);
}

/**
 * Check if a plan has a specific feature
 */
export function planHasFeature(
    planId: SubscriptionPlan,
    feature: keyof PlanConfig['features']
): boolean {
    return PLAN_CONFIGS[planId].features[feature];
}

/**
 * Get the limit value for a specific plan
 */
export function getPlanLimit(
    planId: SubscriptionPlan,
    limit: keyof PlanConfig['limits']
): number {
    return PLAN_CONFIGS[planId].limits[limit];
}

/**
 * Compare two plans and return if the first is higher tier
 */
export function isHigherTier(
    planA: SubscriptionPlan,
    planB: SubscriptionPlan
): boolean {
    const tierOrder: SubscriptionPlan[] = ['starter', 'professional', 'enterprise'];
    return tierOrder.indexOf(planA) > tierOrder.indexOf(planB);
}

/**
 * Get the next higher tier plan (or null if already at highest)
 */
export function getNextTier(planId: SubscriptionPlan): SubscriptionPlan | null {
    const tierOrder: SubscriptionPlan[] = ['starter', 'professional', 'enterprise'];
    const currentIndex = tierOrder.indexOf(planId);

    if (currentIndex === -1 || currentIndex === tierOrder.length - 1) {
        return null;
    }

    return tierOrder[currentIndex + 1];
}

/**
 * Advanced workflow types that require professional or higher plan
 */
export const ADVANCED_WORKFLOW_TYPES = [
    'file',
    'multiple_choice',
] as const;

/**
 * Check if a workflow type requires an advanced plan
 */
export function isAdvancedWorkflowType(stepType: string): boolean {
    return ADVANCED_WORKFLOW_TYPES.includes(stepType as any);
}
