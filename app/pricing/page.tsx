/**
 * Public Pricing Page
 * 
 * Accessible to guests (marketing view) and authenticated users (subscription management).
 */

'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useConvexAuth } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SubscriptionPlans } from '@/features/subscription/components/subscription-plans';
import { PricingModern } from '@/features/landing/components/pricing';
import { PageHeader } from '@/components/page-header';
import { PageShell } from '@/components/page-shell';
import { Loader2 } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '@/components/ui/typography';
import Header from '@/components/layout/header';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1">
                <Suspense fallback={<PricingLoading />}>
                    <PricingContent />
                </Suspense>
            </main>
        </div>
    );
}

function PricingContent() {
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const orgIdFromUrl = searchParams.get('orgId') as Id<'organisations'> | null;
    const isWelcome = searchParams.get('welcome') === 'true';

    const organisations = useQuery(
        api.organisation.getUserOrganisations,
        isAuthenticated ? {} : 'skip'
    );

    useEffect(() => {
        if (isAuthenticated && organisations && organisations.length > 0) {
            const targetOrg = orgIdFromUrl
                ? organisations.find(org => org._id === orgIdFromUrl)
                : organisations[0];

            if (targetOrg) {
                const params = new URLSearchParams();
                if (orgIdFromUrl) params.set('orgId', orgIdFromUrl);
                if (isWelcome) params.set('welcome', 'true');
                router.replace(`/settings/billing?${params.toString()}`);
            }
        }
    }, [isAuthenticated, organisations, orgIdFromUrl, isWelcome, router]);

    if (authLoading || (isAuthenticated && organisations === undefined)) {
        return <PricingLoading />;
    }

    // If authenticated but no organisations, or not authenticated, show general marketing pricing
    // (Authenticated but no orgs shouldn't usually happen except during onboarding, 
    // but the redirect above should handle the transition once the org is created)
    return <PricingModern />;
}

function PricingLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading pricing details...</p>
        </div>
    );
}
