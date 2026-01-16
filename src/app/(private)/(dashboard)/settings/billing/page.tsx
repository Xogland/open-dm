"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SubscriptionPlans } from '@/features/subscription/components/subscription-plans';
import { PageHeader } from '@/components/page-header';
import { PageShell } from '@/components/page-shell';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/features/organization/providers/user-data-provider';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { SubscriptionPlan } from '@/features/subscription/types/subscription-types';

export default function BillingPage() {
    return (
        <Suspense fallback={<BillingLoading />}>
            <BillingContent />
        </Suspense>
    );
}

function BillingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { selectedOrganization, organizations } = useUserData();

    const orgIdFromUrl = searchParams.get('orgId') as Id<'organisations'> | null;
    const isWelcome = searchParams.get('welcome') === 'true';

    // Prioritize orgId from URL, then selectedOrganization, then first org
    const targetOrgId = orgIdFromUrl || selectedOrganization?._id || organizations?.[0]?._id;

    const targetOrg = useQuery(
        api.organisation.getOrganisation,
        targetOrgId ? { id: targetOrgId } : 'skip'
    );

    if (targetOrg === undefined) {
        return <BillingLoading />;
    }

    if (!targetOrg) {
        return (
            <PageShell>
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                    <Typography variant="h2">Organization not found</Typography>
                    <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell className="max-w-7xl mx-auto">
            <div className="space-y-8 pb-20">
                {isWelcome ? (
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 p-8 md:p-12 mb-12">
                        <div className="relative z-10 max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold mb-6 animate-bounce">
                                <CheckCircle2 className="w-4 h-4" />
                                Welcome to Open DM!
                            </div>
                            <Typography variant="h1" className="text-4xl md:text-5xl lg:text-6xl mb-6">
                                Let&apos;s supercharge <span className="text-primary">{targetOrg.name}</span>
                            </Typography>
                            <Typography variant="lead" className="text-muted-foreground mb-10">
                                Your organization is set up and ready to go. Choose a plan to unlock premium features, or continue to your dashboard to start exploring.
                            </Typography>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20"
                                    onClick={() => {
                                        const element = document.getElementById('pricing-plans');
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    View Plans
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="rounded-full px-8 h-14 text-lg group"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Continue to Dashboard
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
                    </div>
                ) : (
                    <PageHeader
                        title="Billing & Subscription"
                        description={`Manage subscription and billing for ${targetOrg.name}`}
                    />
                )}

                <div id="pricing-plans" className={cn(
                    "transition-all duration-1000",
                    isWelcome ? "animate-in fade-in slide-in-from-bottom-10" : ""
                )}>
                    <SubscriptionPlans
                        organisationId={targetOrg._id}
                        currentPlan={targetOrg.plan as SubscriptionPlan}
                        debugMode={targetOrg.debugMode}
                    />
                </div>

                {isWelcome && (
                    <div className="mt-20 text-center">
                        <Button
                            variant="link"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => router.push('/dashboard')}
                        >
                            I&apos;ll decide later, take me to my dashboard
                        </Button>
                    </div>
                )}
            </div>
        </PageShell>
    );
}

function BillingLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading billing details...</p>
        </div>
    );
}
