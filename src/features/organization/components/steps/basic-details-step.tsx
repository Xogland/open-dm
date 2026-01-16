"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import HandleInput, { HandleState, CheckHandleResultType } from "../handle-input";

interface BasicDetailsStepProps {
    name: string;
    setName: (name: string) => void;
    handle: string;
    setHandle?: (handle: string) => void; // Optional if handled by onStatusChange
    onHandleStatusChange: (status: HandleState, handle: string, result?: CheckHandleResultType, redemptionKey?: string) => void;
    redemptionKey?: string;
    className?: string;
}

export function BasicDetailsStep({
    name,
    setName,
    handle,
    onHandleStatusChange,
    redemptionKey,
    className,
}: BasicDetailsStepProps) {
    return (
        <div className={cn("space-y-8 animate-in slide-in-from-right-8 duration-500", className)}>
            {/* Name Input */}
            <div className="space-y-3">
                <Label htmlFor="name" className="text-sm ml-1">
                    Organization Name
                </Label>
                <div className="relative group">
                    <Input
                        id="name"
                        placeholder="e.g. Acme Industries"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 bg-secondary/30 border-secondary focus:border-primary/50 focus:bg-background transition-all pl-4 text-lg"
                    />
                </div>
            </div>

            {/* Handle Input */}
            <HandleInput
                initialHandle={handle}
                onStatusChange={onHandleStatusChange}
                redemptionKey={redemptionKey}
                showLabel={true}
            />
        </div>
    );
}
