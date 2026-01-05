"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

interface UpgradeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
}

export function UpgradeDialog({
    open,
    onOpenChange,
    title = "Upgrade your plan",
    description = "You've reached the limit of your current plan. Upgrade to unlock more features and remove limits.",
}: UpgradeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                        <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        <span>Unlimited Organizations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        <span>More Forms</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        <span>Advanced Analytics</span>
                    </div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/pricing">View Plans</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
