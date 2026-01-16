"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Sparkles, TrendingUp } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

export type LimitType = 'submissions' | 'services' | 'storage' | 'teamMembers' | 'organisations' | 'advancedWorkflows';

interface SubscriptionLimitModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organisationId?: Id<"organisations">;
    type: LimitType;
    limit?: number | string;
}

const LIMIT_CONFIGS: Record<LimitType, {
    title: string;
    description: string;
    icon: React.ElementType;
    action: string;
}> = {
    submissions: {
        title: "Submission Limit Reached",
        description: "Your organization has reached the monthly submission limit for the Free plan. Upgrade to keep receiving responses.",
        icon: TrendingUp,
        action: "Unlock Unlimited Submissions"
    },
    services: {
        title: "Service Limit Reached",
        description: "You've reached the maximum number of services allowed on your current plan.",
        icon: Rocket,
        action: "Add More Services"
    },
    storage: {
        title: "Storage Limit Reached",
        description: "Your organization is out of storage space. Upgrade to upload more files.",
        icon: Sparkles,
        action: "Increase Storage"
    },
    teamMembers: {
        title: "Team Member Limit Reached",
        description: "You've reached the maximum number of team members for your current plan.",
        icon: Rocket,
        action: "Expand Your Team"
    },
    organisations: {
        title: "Organization Limit Reached",
        description: "You've reached the maximum limit of organizations allowed on your current plan.",
        icon: Rocket,
        action: "Create More Organizations"
    },
    advancedWorkflows: {
        title: "Premium Step Type",
        description: "This step type (Multiple Choice, File Upload) is only available on paid plans.",
        icon: Sparkles,
        action: "Unlock Premium Steps"
    }
};

export function SubscriptionLimitModal({
    open,
    onOpenChange,
    organisationId,
    type,
    limit,
}: SubscriptionLimitModalProps) {
    const config = LIMIT_CONFIGS[type];
    const Icon = config.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">{config.title}</DialogTitle>
                    <DialogDescription className="text-base pt-2">
                        {config.description}
                        {limit && <span className="block mt-1 font-medium text-foreground">Current Limit: {limit}</span>}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span>Remove all platform limits</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span>Unlock advanced analytics</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span>Custom branding & domains</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center flex flex-col sm:flex-row gap-3">
                    <Button asChild className="w-full sm:w-auto min-w-[160px] h-11 text-base shadow-lg shadow-primary/20">
                        <Link href={`/settings/billing${organisationId ? `?orgId=${organisationId}` : ''}`}>
                            {config.action}
                        </Link>
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full sm:w-auto text-muted-foreground h-11"
                        onClick={() => onOpenChange(false)}
                    >
                        Maybe Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
