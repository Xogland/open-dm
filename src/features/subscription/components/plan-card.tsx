/**
 * Plan Card Component
 * 
 * Displays an individual subscription plan with pricing, features, and CTA.
 */

'use client';

import { PlanConfig, BillingCycle } from '../types/subscription-types';
import { formatPrice } from '../utils/subscription-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Typography } from '@/components/ui/typography';

interface PlanCardProps {
    plan: PlanConfig;
    billingCycle: BillingCycle;
    currentPlan?: string;
    onSelect?: (planId: string, cycle: BillingCycle) => void;
    loading?: boolean;
    isTrialEligible?: boolean;
    variant?: 'default' | 'compact';
    footer?: React.ReactNode;
}

export function PlanCard({
    plan,
    billingCycle,
    currentPlan,
    onSelect,
    loading = false,
    isTrialEligible = false,
    variant = 'default',
    footer,
}: PlanCardProps) {
    const price = billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.annual;
    const monthlyPrice = billingCycle === 'annual' ? plan.pricing.annual / 12 : price;
    const isCurrentPlan = currentPlan === plan.id;
    const isFree = price === 0;
    const showTrial = isTrialEligible && plan.trialDays && plan.trialDays > 0 && !isFree;

    return (
        <Card
            className={cn(
                'relative flex flex-col transition-all duration-200 h-full',
                plan.ui.popular && 'border-primary shadow-lg z-10',
                isCurrentPlan && 'border-green-500',
                variant === 'compact' && 'p-0'
            )}
        >
            {!(variant === 'compact') && plan.ui.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                        variant={plan.ui.popular ? 'default' : 'secondary'}
                        className="px-3 py-1"
                    >
                        {showTrial ? `${plan.trialDays} Day Free Trial` : plan.ui.badge}
                    </Badge>
                </div>
            )}

            {!(variant === 'compact') && !plan.ui.badge && showTrial && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                        variant="default"
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white border-none"
                    >
                        {plan.trialDays} Day Free Trial
                    </Badge>
                </div>
            )}

            <CardHeader className={cn("text-center pb-4", variant === 'compact' && 'hidden')}>
                <CardTitle><Typography variant="subheading">{plan.name}</Typography></CardTitle>
                <CardDescription>
                    <Typography variant="body" className="text-sm mt-2">
                        {plan.description}
                    </Typography>
                </CardDescription>
            </CardHeader>

            <CardContent className={cn("flex-1", variant === 'compact' && 'hidden')}>
                <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                        <Typography variant="stat" className="font-bold">
                            {formatPrice(monthlyPrice, plan.pricing.currency)}
                        </Typography>
                        {!isFree && <Typography variant="caption">/mo</Typography>}
                    </div>
                    {/* Fixed height space for annual billing text */}
                    <div className="h-5 flex items-center justify-center mt-1">
                        {billingCycle === 'annual' && !isFree && (
                            <Typography variant="caption">
                                {formatPrice(price, plan.pricing.currency)} billed annually
                            </Typography>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {plan.ui.displayFeatures && plan.ui.displayFeatures.length > 0 && (
                        <div className="pt-3 space-y-2">
                            {plan.ui.displayFeatures.map((feature, index) => (
                                <FeatureItem key={index} text={feature} />
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className={cn(variant === 'compact' && 'p-0')}>
                {footer ? footer : (
                    <Button
                        className={cn("w-full", variant === 'compact' && 'w-auto px-8 h-10')}
                        variant={plan.ui.popular ? 'default' : 'outline'}
                        onClick={() => onSelect?.(plan.id, billingCycle)}
                        disabled={loading || isCurrentPlan}
                    >
                        {loading
                            ? 'Processing...'
                            : isCurrentPlan
                                ? 'Current Plan'
                                : showTrial
                                    ? `Start ${plan.trialDays} Day Trial`
                                    : isFree
                                        ? 'Start Free'
                                        : 'Upgrade'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary shrink-0" />
            <Typography variant="body" className="text-sm">{text}</Typography>
        </div>
    );
}
