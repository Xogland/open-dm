"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Progress from "@/components/ui/progress";
import { Typography } from "@/components/ui/typography";
import { HardDrive, Inbox, Zap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function UsageStats({ className }: { className?: string }) {
    const { selectedOrganization } = useUserData();
    const usage = useQuery(api.dashboard.getUsageStats, {
        organisationId: selectedOrganization?._id,
    });

    if (!usage) {
        return (
            <Card className={className}>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader className="">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Usage Statistics
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Submissions Stats */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                            <Inbox className="w-4 h-4 text-muted-foreground" />
                            <Typography variant="small" className="font-medium">
                                Inbound Submissions
                            </Typography>
                        </div>
                        <Typography variant="caption" className="text-muted-foreground">
                            {usage.submissions.used} / {usage.submissions.limit === Infinity ? "∞" : usage.submissions.limit}
                        </Typography>
                    </div>
                    <Progress value={usage.submissions.percentage} className="h-1.5" />
                    <p className="text-[11px] text-muted-foreground">
                        {usage.submissions.limit === Infinity
                            ? "Unlimited submissions available"
                            : `${usage.submissions.remaining} submissions left this month`}
                    </p>
                </div>

                {/* Storage Stats */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "p-1 rounded-md",
                                usage.storage.limitMB === 0 ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                            )}>
                                <HardDrive className="w-3.5 h-3.5" />
                            </div>
                            <Typography variant="small" className="font-medium">
                                Storage Used
                            </Typography>
                        </div>
                        {usage.storage.limitMB === 0 ? (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none text-[9px] px-1.5 h-4 uppercase font-bold tracking-wider">
                                Pro Feature
                            </Badge>
                        ) : (
                            <Typography variant="caption" className="text-muted-foreground">
                                {usage.storage.usedMB < 1 ? usage.storage.usedMB.toFixed(2) : usage.storage.usedMB.toFixed(1)}MB / {usage.storage.limitMB === Infinity ? "∞" : usage.storage.limitMB + "MB"}
                            </Typography>
                        )}
                    </div>

                    <div className="relative">
                        <Progress value={usage.storage.limitMB === 0 ? 0 : usage.storage.percentage} className="h-1.5" />
                        {usage.storage.limitMB === 0 && (
                            <div className="absolute inset-0 bg-muted/20 rounded-full" />
                        )}
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                        <p className="text-muted-foreground">
                            {usage.storage.limitMB === 0 ? "Files & attachments storage" : (
                                usage.storage.limitMB === Infinity
                                    ? "Unlimited storage available"
                                    : `${usage.storage.remainingMB.toFixed(1)}MB available`
                            )}
                        </p>
                        {usage.storage.limitMB === 0 && (
                            <Link href="/pricing" className="text-primary font-bold hover:underline">
                                Upgrade →
                            </Link>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <Typography variant="caption" className="text-muted-foreground block">
                        Current Plan: <span className="text-primary font-medium">{usage.planName}</span>
                    </Typography>
                    <Typography variant="caption" className="text-muted-foreground block text-[10px] mt-1">
                        Resets on {new Date(usage.planRenewalDate).toLocaleDateString()}
                    </Typography>
                </div>
            </CardContent>
        </Card >
    );
}
