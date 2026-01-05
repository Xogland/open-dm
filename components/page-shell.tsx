import React from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    className?: string;
    containerClassName?: string;
    childrenWrapperClassName?: string;
}

export function PageShell({
    children,
    sidebar,
    className,
    containerClassName,
    childrenWrapperClassName
}: PageShellProps) {
    return (
        <div className={cn("flex h-full w-full relative bg-background/50 overflow-hidden", className)}>
            <div className={cn("flex-1 flex flex-col h-full overflow-hidden", childrenWrapperClassName)}>
                <div className={cn("p-4 md:p-8 space-y-6 h-full flex flex-col min-h-0 overflow-auto", containerClassName)}>
                    {children}
                </div>
            </div>
            {sidebar}
        </div>
    );
}
