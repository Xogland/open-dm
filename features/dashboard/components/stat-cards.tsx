"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, MousePointerClick, TrendingUp, Layers } from "lucide-react";

interface StatsCardsProps {
    totalSubmissions: number;
    submissionTrend: number;
    activeServices: number;
    totalViews: number;
    conversionRate: number;
}

export function StatsCards({
    totalSubmissions,
    submissionTrend,
    activeServices,
    totalViews,
    conversionRate
}: StatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-sm bg-secondary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">
                        Total Submissions
                    </CardTitle>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl">{totalSubmissions}</div>
                    <p className="text-xs text-muted-foreground mt-1 text-green-500">
                        {submissionTrend >= 0 ? "+" : ""}{submissionTrend}% from last month
                    </p>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-secondary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">
                        Active Services
                    </CardTitle>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                        <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl">{activeServices}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Active integration points
                    </p>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-secondary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">
                        Total Views
                    </CardTitle>
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                        <MousePointerClick className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl">{totalViews}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Across all devices
                    </p>
                </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-secondary/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">
                        Conversion Rate
                    </CardTitle>
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl">{conversionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Visits to submissions
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
