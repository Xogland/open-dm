"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
    Clock,
    MessageSquare,
    ArrowUpRight,
    User,
    CheckCircle2,
    CircleDashed
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
    id: string;
    email: string;
    serviceName: string;
    creationTime: number;
    score?: number;
}

interface RecentActivityProps {
    activities: ActivityItem[];
    className?: string;
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
    return (
        <Card className={cn("flex flex-col overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between shrink-0 py-4">
                <div>
                    <CardTitle className="text-sm">Global Activity</CardTitle>
                    <CardDescription className="text-[10px]">
                        Recent interactions
                    </CardDescription>
                </div>
                <Clock className="w-4 h-4 text-muted-foreground opacity-50" />
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <div className="relative space-y-4 pr-2">
                    {/* Vertical Line */}
                    <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-border lg:hidden" />

                    {activities.map((activity, index) => (
                        <div key={activity.id} className="relative flex gap-4 items-start group">
                            {/* Icon Wrapper */}
                            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm group-hover:border-primary transition-colors">
                                <MessageSquare className="h-4 w-4 text-primary" />
                            </div>

                            <div className="flex flex-1 flex-col space-y-1 pb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm truncate max-w-[150px]">
                                        {activity.email || "Anonymous Hunter"}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                        {formatDistanceToNow(new Date(activity.creationTime), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0">
                                        {activity.serviceName}
                                    </Badge>
                                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                    <span className="text-xs text-muted-foreground shrink-0">
                                        Submission Received
                                    </span>
                                </div>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>
                    ))}

                    {activities.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                            <div className="p-3 rounded-full bg-secondary/50">
                                <CircleDashed className="w-6 h-6 text-muted-foreground animate-spin-slow" />
                            </div>
                            <p className="text-sm text-muted-foreground">Waiting for new activity...</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// Add a custom animation name if needed to globals.css
// @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

