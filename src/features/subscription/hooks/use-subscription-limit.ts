"use client";

import { useState, useCallback } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { LimitType } from '../components/subscription-limit-modal';
import { useCanPerformAction, useUsageStats } from './use-subscription';
import { SubscriptionAction } from '../types/subscription-types';

export function useSubscriptionLimit(organisationId: Id<"organisations"> | undefined) {
    const [isOpen, setIsOpen] = useState(false);
    const [limitType, setLimitType] = useState<LimitType>('submissions');
    const [limitValue, setLimitValue] = useState<number | string | undefined>();

    const usageStats = useUsageStats(organisationId);

    const checkLimit = useCallback((action: SubscriptionAction, metadata?: any) => {
        // This is a bit tricky because useCanPerformAction is a hook
        // We might need a non-hook version of validation for immediate checks
        // or rely on the usage stats already being loaded.

        if (!usageStats) return true;

        switch (action) {
            case 'add_service':
                if (usageStats.services.current >= usageStats.services.limit) {
                    setLimitType('services');
                    setLimitValue(usageStats.services.limit);
                    setIsOpen(true);
                    return false;
                }
                break;
            case 'add_team_member':
                if (usageStats.teamMembers.current >= usageStats.teamMembers.limit) {
                    setLimitType('teamMembers');
                    setLimitValue(usageStats.teamMembers.limit);
                    setIsOpen(true);
                    return false;
                }
                break;
            case 'upload_file':
                if (usageStats.storage.currentMB >= usageStats.storage.limitMB) {
                    setLimitType('storage');
                    setLimitValue(`${usageStats.storage.limitMB}MB`);
                    setIsOpen(true);
                    return false;
                }
                break;
        }

        return true;
    }, [usageStats]);

    // Check for submission limits specifically (usually checked on page load/mount)
    const checkSubmissionLimit = useCallback(() => {
        if (usageStats && usageStats.submissions.current >= usageStats.submissions.limit) {
            setLimitType('submissions');
            setLimitValue(usageStats.submissions.limit);
            setIsOpen(true);
            return false;
        }
        return true;
    }, [usageStats]);

    return {
        limitModalProps: {
            open: isOpen,
            onOpenChange: setIsOpen,
            type: limitType,
            limit: limitValue,
            organisationId,
        },
        checkLimit,
        checkSubmissionLimit,
        setLimitModalOpen: setIsOpen,
    };
}
