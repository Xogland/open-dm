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
import { Mail } from "lucide-react";

interface OrganizationLimitModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    limit: number;
}

export function OrganizationLimitModal({
    open,
    onOpenChange,
    limit,
}: OrganizationLimitModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Organization Limit Reached</DialogTitle>
                    <DialogDescription>
                        You have reached the maximum limit of {limit} organizations allowed on
                        your current plan.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg border border-dashed border-primary/20">
                    <p className="text-sm text-center text-muted-foreground">
                        Want to create more? Contact our support team to upgrade your
                        account limits or discuss enterprise options.
                    </p>
                </div>
                <DialogFooter className="sm:justify-center flex-col gap-2 sm:flex-row">
                    <Button
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={() => {
                            window.location.href = "mailto:support@open-dm.com";
                        }}
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Support
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => onOpenChange(false)}
                    >
                        Maybe Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
