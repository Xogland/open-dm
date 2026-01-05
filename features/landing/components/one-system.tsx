"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ONE_SYSTEM_CONTENT } from "../constants/landing-content";
import { Typography } from "@/components/ui/typography";

export function OneSystem() {
    return (
        <section className="relative w-full py-24 sm:py-32 overflow-hidden bg-muted/30">
            {/* Subtle Flare */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-[0.05] blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }} />

            <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20"
                >
                    <Typography variant="h1" className="md:text-6xl text-4xl border-none mb-6">
                        {ONE_SYSTEM_CONTENT.title}
                    </Typography>
                    <Typography variant="lead" className="max-w-3xl mx-auto">
                        {ONE_SYSTEM_CONTENT.description}
                    </Typography>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {ONE_SYSTEM_CONTENT.options.map((option, index) => {
                        const Icon = option.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative group"
                            >
                                <div className="h-full p-8 md:p-12 rounded-[2.5rem] bg-card border border-border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                <Icon className="w-8 h-8 text-primary" />
                                            </div>
                                            <Typography variant="h3" as="h3" className="md:text-3xl text-2xl border-none pb-0">{option.title}</Typography>
                                        </div>

                                        <Typography variant="lead" className="text-lg mb-8">
                                            {option.description}
                                        </Typography>

                                        <ul className="space-y-4 mb-8 flex-grow">
                                            {option.items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Check className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                    <Typography as="span" variant="small" className="font-medium text-foreground/90">{item}</Typography>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="pt-8 border-t border-border">
                                            <Typography variant="muted" className="text-sm font-semibold italic">
                                                {option.footer}
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
