"use client";

import { useDashboard } from "../hooks/use-dashboard";
import { StatsCards } from "./stat-cards";
import { RecentActivity } from "./recent-activity";
import { AnalyticsChart } from "./analytics-chart";
import { ServiceChart } from "./service-chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowUpRight, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { CURRENT_PLATFORM_STATUS, PlatformStatus } from "@/constants/platform";
import { PreregistrationView } from "./preregistration-view";
import { MaintenanceView } from "./maintenance-view";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { Typography } from "@/components/ui/typography";

import { UsageStats } from "./usage-stats";

export default function DashboardPage() {
  const {
    stats,
    recentSubmissions,
    isLoading,
    trends,
    navigateToInbox,
    dailyStats,
    serviceDistribution,
  } = useDashboard();

  const { selectedOrganization } = useUserData();

  const copyHandle = () => {
    if (!selectedOrganization) return;
    navigator.clipboard.writeText(selectedOrganization.handle);
    toast.success("Handle copied to clipboard");
  };

  if (isLoading || !stats || !recentSubmissions) {
    return (
      <PageShell>
        <div className="space-y-8 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <div className="grid gap-6 lg:grid-cols-12 flex-1 min-h-0">
            <Skeleton className="lg:col-span-8 h-full rounded-xl" />
            <Skeleton className="lg:col-span-4 h-full rounded-xl" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION) {
    return <PreregistrationView />;
  }

  if (CURRENT_PLATFORM_STATUS === PlatformStatus.MAINTENANCE) {
    return <MaintenanceView />;
  }

  return (
    <PageShell>
      {/* Header */}
      <PageHeader
        title="Overview"
        description={`Welcome back! Here's what's happening with ${selectedOrganization?.name || "your organization"}.`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 px-3 bg-muted/50 rounded-lg border border-border/50">
            <code className="text-[11px] font-mono text-muted-foreground">
              @{selectedOrganization.handle}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-muted"
              onClick={copyHandle}
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Badge
            variant="outline"
            className="h-9 px-4 text-xs border-primary/20 bg-primary/5 text-primary rounded-lg hidden sm:flex capitalize"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-2" />
            {selectedOrganization.plan} Plan
          </Badge>

          <div className="h-9 w-px bg-border mx-1 hidden md:block" />

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 px-4 rounded-lg"
            >
              <Link href={`/${selectedOrganization.handle}`} target="_blank">
                <span className="hidden sm:inline">Live Page</span>{" "}
                <ExternalLink className="sm:ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              onClick={navigateToInbox}
              size="sm"
              className="h-10 px-4 rounded-lg bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              Inbox
            </Button>
          </div>
        </div>
      </PageHeader>

      {/* Stats Row */}
      <StatsCards
        totalSubmissions={stats.totalSubmissions}
        submissionTrend={trends.submissionTrend}
        activeServices={stats.activeServices}
        totalViews={stats.totalViews}
        conversionRate={stats.conversionRate}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Primary Analytics Section */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
          <div className="flex-1 min-h-[400px]">
            <AnalyticsChart data={dailyStats} />
          </div>

          <Card className="shrink-0 border shadow-sm bg-gradient-to-r from-primary/5 to-transparent overflow-hidden relative group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <Typography variant="small" as="h4" className="font-bold">
                  Customize your service workflow
                </Typography>
                <Typography variant="muted" as="p" className="text-xs">
                  Add steps, logic or style your chat flows in the editor.
                </Typography>
              </div>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 group-hover:bg-primary group-hover:text-white transition-all"
              >
                <Link href="/edit">
                  Editor <ArrowUpRight className="ml-2 w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Insights Section */}
        <div className="lg:col-span-4 flex flex-col gap-8 min-h-0">
          <div className="shrink-0 h-[280px]">
            <ServiceChart data={serviceDistribution} />
          </div>

          <UsageStats className="shadow-sm border bg-card" />
        </div>
      </div>
    </PageShell>
  );
}

