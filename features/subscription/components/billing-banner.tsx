'use client';

import React from 'react';
import { useUserData } from '@/features/organization/providers/user-data-provider';
import { useSubscription } from '@/features/subscription/hooks/use-subscription';
import { AlertCircle, CreditCard, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function BillingBanner() {
    const { selectedOrganization } = useUserData();
    const subscription = useSubscription(selectedOrganization?._id);

    if (!subscription) return null;

    const isPastDue = subscription.status === 'past_due';
    const isUnpaid = subscription.status === 'unpaid';
    const isCancelled = subscription.status === 'cancelled';
    const endsAt = subscription.endsAt;

    if (!isPastDue && !isUnpaid && !isCancelled) return null;

    return (
        <div className={cn(
            "w-full px-4 py-2 flex items-center justify-between gap-4 animate-in slide-in-from-top duration-500",
            isPastDue || isUnpaid ? "bg-destructive text-destructive-foreground" : "bg-amber-500 text-white"
        )}>
            <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <Typography variant="small" className="font-medium">
                    {isPastDue && "Your payment failed. Please update your billing information to keep your Pro features active."}
                    {isUnpaid && "Your subscription is unpaid. Professional features have been disabled."}
                    {isCancelled && endsAt && `Your subscription has been cancelled and will expire on ${new Date(endsAt).toLocaleDateString()}.`}
                </Typography>
            </div>

            <div className="flex items-center gap-2">
                {(isPastDue || isUnpaid) && subscription.updatePaymentMethodUrl && (
                    <Button
                        variant="secondary"
                        size="sm"
                        asChild
                        className="h-8 text-xs whitespace-nowrap"
                    >
                        <a href={subscription.updatePaymentMethodUrl} target="_blank" rel="noopener noreferrer">
                            Update Payment
                            <ExternalLink className="ml-1.5 h-3 w-3" />
                        </a>
                    </Button>
                )}
                {isCancelled && (
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 whitespace-nowrap"
                    >
                        <Link href="/settings/billing">
                            Manage Plan
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
