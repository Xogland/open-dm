"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
    children: ReactNode;
    className?: string;
    containerClassName?: string;
    id?: string;
    bg?: "default" | "muted" | "none";
}

export function SectionWrapper({
    children,
    className,
    containerClassName,
    id,
    bg = "default"
}: SectionWrapperProps) {
    const bgStyles = {
        default: "bg-background",
        muted: "bg-muted/30",
        none: ""
    };

    return (
        <section
            id={id}
            className={cn(
                "relative w-full py-24 md:py-32 overflow-hidden",
                bgStyles[bg],
                className
            )}
        >
            <div className={cn("container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10", containerClassName)}>
                {children}
            </div>
        </section>
    );
}

interface SectionHeaderProps {
    title: string;
    description?: string;
    badge?: string;
    badgeIcon?: React.ComponentType<{ className?: string }>;
    className?: string;
}

export function SectionHeader({
    title,
    description,
    badge,
    badgeIcon: BadgeIcon,
    className
}: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("text-center mb-16 md:mb-20", className)}
        >
            {badge && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    {BadgeIcon && <BadgeIcon className="w-4 h-4 text-primary" />}
                    <span className="text-sm font-semibold text-primary">{badge}</span>
                </div>
            )}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                {title}
            </h2>
            {description && (
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {description}
                </p>
            )}
        </motion.div>
    );
}
