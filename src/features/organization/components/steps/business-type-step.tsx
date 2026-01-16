"use client";

import { cn } from "@/lib/utils";
import {
    Users,
    Briefcase,
    Building2,
    Store,
    LucideIcon,
} from "lucide-react";

export const BUSINESS_TYPES = [
    { label: "Creators", icon: Users },
    { label: "Freelancers", icon: Briefcase },
    { label: "Consultants", icon: Building2 },
    { label: "Professional Services", icon: Briefcase },
    { label: "Agencies", icon: Building2 },
    { label: "SMEs", icon: Store },
];

interface BusinessTypeStepProps {
    businessType: string;
    setBusinessType: (type: string) => void;
    className?: string;
}

export function BusinessTypeStep({
    businessType,
    setBusinessType,
    className
}: BusinessTypeStepProps) {
    return (
        <div className={cn("space-y-6 animate-in slide-in-from-right-8 duration-500", className)}>
            <div className="grid grid-cols-2 gap-4">
                {BUSINESS_TYPES.map(({ label, icon: Icon }) => (
                    <div
                        key={label}
                        onClick={() => setBusinessType(label)}
                        className={cn(
                            "group flex flex-col items-center justify-center p-6 rounded-2xl border transition-all cursor-pointer duration-300",
                            businessType === label
                                ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 relative overflow-hidden"
                                : "border-border/40 bg-card/40 hover:border-primary/30 hover:bg-accent/40"
                        )}
                    >
                        <div
                            className={cn(
                                "h-14 w-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-sm",
                                businessType === label
                                    ? "bg-primary text-primary-foreground scale-110 shadow-primary/30"
                                    : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}
                        >
                            <Icon className="h-6 w-6" />
                        </div>
                        <span
                            className={cn(
                                "text-sm text-center transition-colors",
                                businessType === label
                                    ? "text-primary"
                                    : "text-muted-foreground group-hover:text-foreground"
                            )}
                        >
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
