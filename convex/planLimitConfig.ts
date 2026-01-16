
/**
 * Subscription Plan Configuration
 * 
 * Centralized configuration for all subscription plans.
 * This is the single source of truth for plan limits, features, and pricing.
 */

export type SubscriptionPlan = 'free' | 'beginner' | 'pro' | 'max';

export interface PlanConfig {
    id: SubscriptionPlan;
    name: string;
    description: string;
    trialDays?: number;

    pricing: {
        monthly: number;
        annual: number;
        currency: string;
    };

    limits: {
        servicesLimit: number; // Max number of services/forms
        submissionsPerMonth: number;
        storageLimit: number; // MB
        teamMembersLimit: number; // EXTRA members (excluding owner)
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
        badge?: string;
        popular: boolean;
        color: string;
        cta: string;
        displayFeatures: string[];
    };
}

/**
 * All available subscription plans with their configurations
 */
export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanConfig> = {
    free: {
        id: 'free',
        name: 'Free',
        description: 'Launch Contact',

        pricing: {
            monthly: 0,
            annual: 0,
            currency: 'USD',
        },

        limits: {
            servicesLimit: Infinity,
            submissionsPerMonth: 20,
            storageLimit: 0,
            teamMembersLimit: 0,
            analyticsRetention: 7,
        },

        features: {
            customBranding: false,
            prioritySupport: false,
            apiAccess: false,
            advancedWorkflows: false,
            customDomain: true,
            exportData: false,
            webhooks: false,
            analytics: false,
        },

        ui: {
            badge: 'Free',
            popular: false,
            color: '#6B7280',
            cta: 'Start Free',
            displayFeatures: [
                'Business & Contact profile',
                'Connect all social media accounts',
                'Connect Tools and websites',
                '20 inbound submissions',
                'Inbox with history',
                'Client management portal',
                'Connect domain',
            ],
        },
    },

    beginner: {
        id: 'beginner',
        name: 'Beginner',
        description: 'Launch Contact',
        trialDays: 7,

        pricing: {
            monthly: 9.99,
            annual: 99.99,
            currency: 'USD',
        },

        limits: {
            servicesLimit: Infinity,
            submissionsPerMonth: 200,
            storageLimit: 1024, // 1GB in MB
            teamMembersLimit: 1, // 2 total including owner
            analyticsRetention: 30,
        },

        features: {
            customBranding: true,
            prioritySupport: false,
            apiAccess: true,
            advancedWorkflows: true,
            customDomain: true,
            exportData: true,
            webhooks: true,
            analytics: true,
        },

        ui: {
            badge: 'Launch',
            popular: false,
            color: '#6B7280',
            cta: 'Start Beginner',
            displayFeatures: [
                'Business & Contact profile',
                'Connect all social media accounts',
                'Connect Tools and websites',
                '200 inbound submissions',
                'Storage space up to 1 GB',
                'Inbox with history',
                'Client management portal',
                'Connect domain',
                'Full access to workflow manager',
                'Team access with 2 seats',
            ],
        },
    },

    pro: {
        id: 'pro',
        name: 'Grow',
        description: 'Grow Contact',
        trialDays: 7,

        pricing: {
            monthly: 29.99,
            annual: 299.99,
            currency: 'USD',
        },

        limits: {
            servicesLimit: Infinity,
            submissionsPerMonth: 2000,
            storageLimit: 5120, // 5GB in MB
            teamMembersLimit: 9, // 10 total including owner
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
            cta: 'Start Pro',
            displayFeatures: [
                'Everything in Beginner+',
                '2000 inbound submissions',
                'Storage space up to 5 GB',
                'Team access with 10 seats',
                'Paid DMs or Paid inquiry requests',
                'Stripe payments (0% platform fees)',
            ],
        },
    },

    max: {
        id: 'max',
        name: 'Scale',
        description: 'Scale Contact',
        trialDays: 7,

        pricing: {
            monthly: 99.99,
            annual: 999.99,
            currency: 'USD',
        },

        limits: {
            servicesLimit: Infinity,
            submissionsPerMonth: 20000,
            storageLimit: 51200, // 50GB in MB
            teamMembersLimit: 49, // 50 total including owner
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
            cta: 'Start Max',
            displayFeatures: [
                'Everything in Pro+',
                '20,000 inbound submissions',
                'Storages space up to 50 GB',
                'Team access with 50 seats',
                'Advance Analytics',
                'Priority support',
            ],
        },
    },
};

export function getPlanConfig(planId: SubscriptionPlan | string): PlanConfig {
    return PLAN_CONFIGS[planId as SubscriptionPlan] || PLAN_CONFIGS.free;
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
    feature: keyof PlanConfig["features"],
): boolean {
    return PLAN_CONFIGS[planId].features[feature];
}

/**
 * Get the limit value for a specific plan
 */
export function getPlanLimit(
    planId: SubscriptionPlan,
    limit: keyof PlanConfig["limits"],
): number {
    return PLAN_CONFIGS[planId].limits[limit];
}

/**
 * Compare two plans and return if the first is higher tier
 */
export function isHigherTier(
    planA: SubscriptionPlan,
    planB: SubscriptionPlan,
): boolean {
    const tierOrder: SubscriptionPlan[] = [
        "free",
        "beginner",
        "pro",
        "max",
    ];
    return tierOrder.indexOf(planA) > tierOrder.indexOf(planB);
}

/**
 * Get the next higher tier plan (or null if already at highest)
 */
export function getNextTier(planId: SubscriptionPlan): SubscriptionPlan | null {
    const tierOrder: SubscriptionPlan[] = [
        "free",
        "beginner",
        "pro",
        "max",
    ];
    const currentIndex = tierOrder.indexOf(planId);

    if (currentIndex === -1 || currentIndex === tierOrder.length - 1) {
        return null;
    }

    return tierOrder[currentIndex + 1];
}

/**
 * Advanced workflow types that require professional or higher plan
 */
export const ADVANCED_WORKFLOW_TYPES = ["file", "multiple_choice", "payment"] as const;

/**
 * Check if a workflow type requires an advanced plan
 */
export function isAdvancedWorkflowType(stepType: string): boolean {
    return ADVANCED_WORKFLOW_TYPES.includes(stepType as any);
}


