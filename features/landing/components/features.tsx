"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, ImageIcon } from "lucide-react";
import { FEATURES } from "../constants/landing-content";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";

export function FeaturesNew() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative w-full py-24 sm:py-32 overflow-hidden">
            <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 space-y-10"
                >
                    <Typography variant="h2" className="md:text-5xl text-4xl border-none">
                        Built for Modern Professionals, More Than a Contact Page
                    </Typography>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="w-full"
                    >
                        <div className="relative h-150 rounded-3xl border border-border bg-muted/20 flex flex-col items-center justify-center overflow-hidden shadow-2xl group transition-all duration-500 hover:border-primary/50">
                            <div className="absolute inset-0 bg-white group-hover:opacity-100 transition-opacity" />
                            <div className="text-center space-y-4 relative z-10 px-6">
                                <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                    <ImageIcon />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <div className="space-y-0 border-t border-border">
                        {FEATURES.map((feature, index) => {
                            const isOpen = openIndex === index;
                            // Strip trailing " +" from the title as we use a real icon
                            const displayTitle = feature.title.replace(/\s*\+\s*$/, "");
                            const textColorClass = feature.color;
                            const bgColorClass = feature.bg;

                            return (
                                <div key={index} className="border-b border-border">
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="w-full py-6 md:py-8 flex items-center justify-between text-left group transition-all"
                                    >
                                        <Typography
                                            as="h3"
                                            variant="h3"
                                            className={cn(
                                                "md:text-2xl text-xl font-semibold transition-colors pr-4",
                                                isOpen ? textColorClass : "text-muted-foreground group-hover:text-foreground"
                                            )}
                                        >
                                            {displayTitle}
                                        </Typography>
                                        <div className={cn(
                                            "transition-all duration-300 flex-shrink-0",
                                            isOpen ? "rotate-45" : "rotate-0",
                                            isOpen ? textColorClass : "text-muted-foreground group-hover:text-foreground"
                                        )}>
                                            <Plus className="w-6 h-6 md:w-8 md:h-8" />
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-8 space-y-8">
                                                    <Typography variant="lead" className="md:text-xl text-lg text-foreground/80 leading-relaxed">
                                                        {feature.description}
                                                    </Typography>

                                                    {feature.items && (
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {feature.items.map((item: string, i: number) => {
                                                                const parts = item.split(':');
                                                                return (
                                                                    <div key={i} className="flex items-start gap-4">
                                                                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", bgColorClass)}>
                                                                            <Check className={cn("w-4 h-4", textColorClass)} />
                                                                        </div>
                                                                        <Typography as="span" className="text-lg">
                                                                            {parts.length > 1 ? (
                                                                                <>
                                                                                    <span className="font-bold">{parts[0]}:</span>
                                                                                    <span className="text-muted-foreground ml-1">{parts.slice(1).join(':')}</span>
                                                                                </>
                                                                            ) : (
                                                                                <span className="text-foreground/90">{item}</span>
                                                                            )}
                                                                        </Typography>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {feature.subsections && (
                                                        <div className="space-y-6">
                                                            {feature.subsections.map((sub: any, i: number) => (
                                                                <div key={i} className="space-y-2 p-6 rounded-2xl bg-muted/30 border border-border/50">
                                                                    <Typography variant="h4" as="h4" className="font-bold flex items-center gap-2 text-lg">
                                                                        {sub.title.includes("Coming Soon") ? (
                                                                            <>
                                                                                {sub.title.replace(" - Coming Soon", "")}
                                                                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Soon</span>
                                                                            </>
                                                                        ) : sub.title}
                                                                    </Typography>
                                                                    <Typography variant="muted" className="leading-relaxed italic">
                                                                        {sub.description}
                                                                    </Typography>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {feature.footer && (
                                                        <div className="pt-4 border-t border-border/50">
                                                            <Typography variant="muted" className="text-sm font-semibold italic">
                                                                {feature.footer}
                                                            </Typography>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}


