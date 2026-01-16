"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Hammer, Cog, AlertCircle } from "lucide-react";
import { Typography } from "@/components/ui/typography";

export function MaintenanceView() {
    return (
        <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto w-full">
            <div className="h-20 w-20 rounded-full bg-yellow-500/10 flex items-center justify-center animate-pulse">
                <Hammer className="h-10 w-10 text-yellow-500" />
            </div>

            <div className="text-center space-y-4">
                <Typography variant="h1">Under Maintenance</Typography>
                <Typography variant="lead">
                    We&apos;re currently performing some scheduled maintenance to improve your experience.
                    We&apos;ll be back online shortly.
                </Typography>
            </div>

            <Card className="bg-card/50 border-yellow-500/20 w-full">
                <CardHeader className="flex flex-row items-center space-x-4">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">What&apos;s happening?</CardTitle>
                        <CardDescription>System upgrades & database optimization</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Cog className="h-4 w-4 animate-spin-slow" />
                        <span>Estimated downtime: 2 hours</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
