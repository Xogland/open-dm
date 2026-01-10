/**
 * Subscription Guard Component
 * 
 * Wraps features that require specific subscription plans.
 * Shows upgrade prompt when feature is locked.
 */

'use client';

import { ReactNode } from 'react';
import { usePlanFeatures, useCurrentPlan } from '../hooks/use-subscription';
import { Id } from '@/convex/_generated/dataModel';
import { PlanConfig } from '../types/subscription-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';

interface SubscriptionGuardProps {
    organisationId: Id<"organisations">;
    feature: keyof PlanConfig['features'];
    children: ReactNode;
    fallback?: ReactNode;
    showUpgradePrompt?: boolean;
}

export function SubscriptionGuard({
    organisationId,
    feature,
    children,
    fallback,
    showUpgradePrompt = true,
}: SubscriptionGuardProps) {
    const features = usePlanFeatures(organisationId);
    const currentPlan = useCurrentPlan(organisationId);

    if (!features || !currentPlan) {
        return null;
    }

    const hasFeature = features[feature];

    if (hasFeature) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    if (showUpgradePrompt) {
        return (
            <Card className="border-dashed">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">Feature Locked</CardTitle>
                    </div>
                    <CardDescription>
                        This feature requires a Professional or Enterprise plan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href={`/settings/billing?orgId=${organisationId}`}>
                        <Button>Upgrade to Unlock</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return null;
}
