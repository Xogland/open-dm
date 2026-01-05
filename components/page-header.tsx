import React from "react";
import { Typography } from "@/components/ui/typography";

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <Typography variant="h3" as="h1" className="font-bold tracking-tight">
                    {title}
                </Typography>
                {description && (
                    <Typography variant="muted" as="p" className="mt-1">
                        {description}
                    </Typography>
                )}
            </div>
            {children && <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">{children}</div>}
        </div>
    );
}
