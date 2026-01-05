"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface SplitFeatureItem {
    title: string;
    description?: string;
}

interface SplitFeatureSectionProps {
    title: string;
    items: SplitFeatureItem[];
    imageSrc?: string;
    imageAlt: string;
    imageAtLeft?: boolean;
    className?: string;
    bg?: "default" | "muted";
    showPlaceholder?: boolean;
}

export function SplitFeatureSection({
    title,
    items,
    imageSrc,
    imageAlt,
    imageAtLeft = true,
    className,
    bg = "default",
    showPlaceholder = false
}: SplitFeatureSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className={cn(
            "w-full py-24",
            bg === "muted" ? "bg-muted/30" : "bg-background",
            className
        )}>
            <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">
                <div className={cn(
                    "flex flex-col lg:flex-row items-center gap-12 lg:gap-24",
                    !imageAtLeft && "lg:flex-row-reverse"
                )}>
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: imageAtLeft ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 w-full"
                    >
                        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-border bg-muted/50 flex items-center justify-center">
                            {showPlaceholder || !imageSrc ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mb-4">
                                        <ImageIcon className="w-10 h-10 text-primary" />
                                    </div>
                                </div>
                            ) : (
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: imageAtLeft ? 40 : -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 space-y-10"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                            {title}
                        </h2>

                        <div className="space-y-0 border-t border-border">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className="border-b border-border"
                                >
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full py-6 flex items-center justify-between text-left group transition-colors"
                                    >
                                        <h3 className={cn(
                                            "text-xl md:text-2xl font-medium transition-colors",
                                            openIndex === index ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                        )}>
                                            {item.title}
                                        </h3>
                                        <div className={cn(
                                            "p-2 rounded-full transition-all duration-300",
                                            openIndex === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                        )}>
                                            {openIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {openIndex === index && item.description && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pb-6 text-lg text-muted-foreground leading-relaxed">
                                                    {item.description}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
