/**
 * Subscription Hooks
 * 
 * React hooks for accessing subscription state and performing actions.
 */

'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
    SubscriptionPlan,
    ActionValidationResult,
    SubscriptionAction,
    UsageStats
} from '../types/subscription-types';
import { getPlanConfig } from '../config/plan-config';
import { validateAction, calculateUsageStats } from '../services/subscription-service';
import { useMemo } from 'react';

/**
 * Get subscription for an organisation
 */
export function useSubscription(organisationId: Id<"organisations"> | undefined) {
    const subscription = useQuery(
      api.subscriptions.getSubscriptionByOrganisation,
      organisationId ? { organisationId } : "skip",
    );

    return subscription;
}

/**
 * Get current user's subscription
 */
export function useCurrentUserSubscription() {
    const subscription = useQuery(api.subscriptions.getCurrentUserSubscription);
    return subscription;
}

/**
 * Get usage statistics for an organisation
 */
export function useUsageStats(organisationId: Id<"organisations"> | undefined) {
    const rawUsage = useQuery(
        api.subscriptions.getSubscriptionUsage,
        organisationId ? { organisationId } : 'skip'
    );

    const subscription = useSubscription(organisationId);

    const usageStats = useMemo(() => {
        if (!rawUsage || !subscription) return null;

        return calculateUsageStats(rawUsage, subscription.planId as SubscriptionPlan);
    }, [rawUsage, subscription]);

    return usageStats;
}

/**
 * Get plan limits for current subscription
 */
export function usePlanLimits(organisationId: Id<"organisations"> | undefined) {
    const subscription = useSubscription(organisationId);

    const limits = useMemo(() => {
        if (!subscription) return null;

        const config = getPlanConfig(subscription.planId as SubscriptionPlan);
        return config.limits;
    }, [subscription]);

    return limits;
}

/**
 * Get plan features for current subscription
 */
export function usePlanFeatures(organisationId: Id<"organisations"> | undefined) {
    const subscription = useSubscription(organisationId);

    const features = useMemo(() => {
        if (!subscription) return null;

        const config = getPlanConfig(subscription.planId as SubscriptionPlan);
        return config.features;
    }, [subscription]);

    return features;
}

/**
 * Check if an action can be performed under current plan
 */
export function useCanPerformAction(
    organisationId: Id<"organisations"> | undefined,
    action: SubscriptionAction,
    metadata?: {
        fileSize?: number;
        workflowType?: string;
    }
): ActionValidationResult {
    const subscription = useSubscription(organisationId);
    const rawUsage = useQuery(
        api.subscriptions.getSubscriptionUsage,
        organisationId ? { organisationId } : 'skip'
    );

    const result = useMemo(() => {
        if (!subscription || !rawUsage) {
            return { allowed: true }; // Default to allowing if data not loaded
        }

        return validateAction(
            action,
            subscription.planId as SubscriptionPlan,
            {
                services: rawUsage.services,
                teamMembers: rawUsage.teamMembers,
                storageMB: rawUsage.storageMB,
            },
            metadata
        );
    }, [subscription, rawUsage, action, metadata]);

    return result;
}

/**
 * Get current plan configuration
 */
export function useCurrentPlan(organisationId: Id<"organisations"> | undefined) {
    const subscription = useSubscription(organisationId);

    const planConfig = useMemo(() => {
        if (!subscription) return null;

        return getPlanConfig(subscription.planId as SubscriptionPlan);
    }, [subscription]);

    return planConfig;
}
