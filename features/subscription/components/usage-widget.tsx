/**
 * Usage Widget Component
 * 
 * Displays current usage statistics with progress bars and upgrade prompts.
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useUsageStats, useCurrentPlan } from '../hooks/use-subscription';
import { Id } from '@/convex/_generated/dataModel';
import { formatStorageSize, isApproachingLimit } from '../utils/subscription-utils';
import { AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface UsageWidgetProps {
    organisationId: Id<"organisations">;
    compact?: boolean;
}

export function UsageWidget({ organisationId, compact = false }: UsageWidgetProps) {
    const usageStats = useUsageStats(organisationId);
    const currentPlan = useCurrentPlan(organisationId);

    if (!usageStats || !currentPlan) {
        return null;
    }

    const showUpgradePrompt =
        isApproachingLimit(usageStats.services.current, usageStats.services.limit) ||
        isApproachingLimit(usageStats.storage.currentMB, usageStats.storage.limitMB) ||
        isApproachingLimit(usageStats.teamMembers.current, usageStats.teamMembers.limit);

    if (compact) {
        return (
            <Card className="border-none shadow-none">
                <CardContent className="p-4 space-y-3">
                    <UsageItem
                        label="Services"
                        current={usageStats.services.current}
                        limit={usageStats.services.limit}
                        percentage={usageStats.services.percentage}
                    />
                    <UsageItem
                        label="Storage"
                        current={usageStats.storage.currentMB}
                        limit={usageStats.storage.limitMB}
                        percentage={usageStats.storage.percentage}
                        formatter={formatStorageSize}
                    />
                    <UsageItem
                        label="Team"
                        current={usageStats.teamMembers.current}
                        limit={usageStats.teamMembers.limit}
                        percentage={usageStats.teamMembers.percentage}
                    />

                    {showUpgradePrompt && (
                        <Link href="/pricing">
                            <Button variant="outline" size="sm" className="w-full mt-2">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Upgrade Plan
                            </Button>
                        </Link>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Usage</CardTitle>
                <CardDescription>
                    Current plan: <span className="font-medium">{currentPlan.name}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <UsageItem
                    label="Services"
                    current={usageStats.services.current}
                    limit={usageStats.services.limit}
                    percentage={usageStats.services.percentage}
                />

                <UsageItem
                    label="Storage"
                    current={usageStats.storage.currentMB}
                    limit={usageStats.storage.limitMB}
                    percentage={usageStats.storage.percentage}
                    formatter={formatStorageSize}
                />

                <UsageItem
                    label="Team Members"
                    current={usageStats.teamMembers.current}
                    limit={usageStats.teamMembers.limit}
                    percentage={usageStats.teamMembers.percentage}
                />

                {showUpgradePrompt && (
                    <div className="pt-4 border-t">
                        <div className="flex items-start gap-2 mb-3">
                            <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                            <p className="text-sm text-muted-foreground">
                                You're approaching your plan limits. Upgrade for more capacity.
                            </p>
                        </div>
                        <Link href="/pricing">
                            <Button variant="default" size="sm" className="w-full">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Upgrade Plan
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface UsageItemProps {
    label: string;
    current: number;
    limit: number;
    percentage: number;
    formatter?: (value: number) => string;
}

function UsageItem({ label, current, limit, percentage, formatter }: UsageItemProps) {
    const isUnlimited = limit === Infinity;
    const isNearLimit = percentage >= 80;

    const formatValue = formatter || ((v: number) => v.toString());

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">
                    {formatValue(current)} / {isUnlimited ? '∞' : formatValue(limit)}
                </span>
            </div>
            {!isUnlimited && (
                <Progress
                    value={percentage}
                    className="h-2"
                    indicatorClassName={isNearLimit ? 'bg-orange-500' : undefined}
                />
            )}
        </div>
    );
}
