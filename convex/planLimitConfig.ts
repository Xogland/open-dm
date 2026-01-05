
/**
 * Subscription Plan Configuration
 * 
 * Centralized configuration for all subscription plans.
 * This is the single source of truth for plan limits, features, and pricing.
 */

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise';

export interface PlanConfig {
    id: SubscriptionPlan;
    name: string;
    description: string;

    pricing: {
        monthly: number;
        annual: number;
        currency: string;
    };

    limits: {
        servicesLimit: number; // Max number of services/forms
        submissionsPerMonth: number;
        storageLimit: number; // MB
        teamMembersLimit: number;
        analyticsRetention: number; // Days
    };

    features: {
        customBranding: boolean;
        prioritySupport: boolean;
        apiAccess: boolean;
        advancedWorkflows: boolean;
        customDomain: boolean;
        exportData: boolean;
        webhooks: boolean;
        analytics: boolean;
    };

    ui: {
        badge: string;
        popular: boolean;
        color: string;
    };
}

/**
 * All available subscription plans with their configurations
 */
export const PLAN_CONFIGS: Record<SubscriptionPlan | string, PlanConfig> = {
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

// Backwards compatibility mapping
export const PLAN_MAPPING: Record<string, SubscriptionPlan> = {
    'free': 'starter',
    'pro': 'professional',
    'business': 'enterprise'
};

export function getPlanConfig(planId: string): PlanConfig {
    // Handle both new and legacy IDs
    const normalizedId = PLAN_MAPPING[planId] || planId;
    return PLAN_CONFIGS[normalizedId] || PLAN_CONFIGS.starter;
}
