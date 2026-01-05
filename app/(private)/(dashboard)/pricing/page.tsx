/**
 * Pricing Page
 * 
 * Displays subscription plans using Lemon Squeezy integration.
 */

'use client';

import { SubscriptionPlans } from '@/features/subscription/components/subscription-plans';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

import { PageHeader } from '@/components/page-header';
import { PageShell } from '@/components/page-shell';

export default function PricingPage() {
  // Get user's organisations
  const organisations = useQuery(api.organisation.getUserOrganisations);
  const selectedOrganisation = organisations?.[0]; // Default to first for now, or use actual selected
  const organisationId = selectedOrganisation?._id;
  const currentPlan = selectedOrganisation?.plan;
  const debugMode = selectedOrganisation?.debugMode;

  return (
    <PageShell>
      <PageHeader
        title="Subscription Plans"
        description="Select the perfect plan for your needs. Upgrade, downgrade, or cancel anytime."
      />

      <div className="flex-1">
        {!organisationId ? (
          <PricingPageSkeleton />
        ) : (
          <SubscriptionPlans
            organisationId={organisationId}
            currentPlan={currentPlan as any}
            debugMode={debugMode}
          />
        )}
      </div>
    </PageShell>
  );
}

function PricingPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl animate-pulse">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border shadow-sm rounded-2xl overflow-hidden bg-card/50">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
            <Skeleton className="h-12 w-32 rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
