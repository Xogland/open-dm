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

interface PlanCardProps {
    plan: PlanConfig;
    billingCycle: BillingCycle;
    currentPlan?: string;
    onSelect: (planId: string, cycle: BillingCycle) => void;
    loading?: boolean;
}

export function PlanCard({
    plan,
    billingCycle,
    currentPlan,
    onSelect,
    loading = false,
}: PlanCardProps) {
    const price = billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.annual;
    const monthlyPrice = billingCycle === 'annual' ? plan.pricing.annual / 12 : price;
    const isCurrentPlan = currentPlan === plan.id;
    const isFree = price === 0;

    return (
        <Card
            className={cn(
                'relative flex flex-col transition-all duration-200',
                plan.ui.popular && 'border-primary shadow-lg scale-105',
                isCurrentPlan && 'border-green-500'
            )}
        >
            {plan.ui.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                        variant={plan.ui.popular ? 'default' : 'secondary'}
                        className="px-3 py-1"
                    >
                        {plan.ui.badge}
                    </Badge>
                </div>
            )}

            <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm mt-2">
                    {plan.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">
                            {formatPrice(monthlyPrice, plan.pricing.currency)}
                        </span>
                        {!isFree && <span className="text-muted-foreground">/month</span>}
                    </div>
                    {billingCycle === 'annual' && !isFree && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(price, plan.pricing.currency)} billed annually
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    {/* Limits */}
                    <div className="space-y-2">
                        <FeatureItem
                            text={
                                plan.limits.servicesLimit === Infinity
                                    ? 'Unlimited services'
                                    : `${plan.limits.servicesLimit} services`
                            }
                        />
                        <FeatureItem text="Unlimited submissions" />
                        <FeatureItem
                            text={`${Math.round(plan.limits.storageLimit / 1024)}GB storage`}
                        />
                        <FeatureItem
                            text={
                                plan.limits.teamMembersLimit === Infinity
                                    ? 'Unlimited team members'
                                    : plan.limits.teamMembersLimit === 0
                                        ? 'Solo (no team members)'
                                        : `Up to ${plan.limits.teamMembersLimit} team members`
                            }
                        />
                    </div>

                    {/* Features */}
                    {Object.entries(plan.features).some(([_, enabled]) => enabled) && (
                        <div className="pt-3 border-t space-y-2">
                            {plan.features.customBranding && (
                                <FeatureItem text="Custom branding" />
                            )}
                            {plan.features.advancedWorkflows && (
                                <FeatureItem text="Advanced workflows" />
                            )}
                            {plan.features.customDomain && (
                                <FeatureItem text="Custom domain" />
                            )}
                            {plan.features.apiAccess && <FeatureItem text="API access" />}
                            {plan.features.prioritySupport && (
                                <FeatureItem text="Priority support" />
                            )}
                            {plan.features.analytics && (
                                <FeatureItem text="Advanced analytics" />
                            )}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    className="w-full"
                    variant={plan.ui.popular ? 'default' : 'outline'}
                    onClick={() => onSelect(plan.id, billingCycle)}
                    disabled={loading || isCurrentPlan}
                >
                    {loading
                        ? 'Processing...'
                        : isCurrentPlan
                            ? 'Current Plan'
                            : isFree
                                ? 'Get Started'
                                : 'Upgrade'}
                </Button>
            </CardFooter>
        </Card>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{text}</span>
        </div>
    );
}
