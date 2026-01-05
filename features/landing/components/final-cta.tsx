"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { FINAL_CTA_CONTENT } from "../constants/landing-content";

export function FinalCTA() {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <section className="relative w-full py-24 sm:py-32 overflow-hidden">
            <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-6xl relative z-20">
                <div className="relative p-8 md:p-16 rounded-[3rem] bg-muted/50 border border-border overflow-hidden">
                    <div className="flex flex-col items-center text-center space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                {FINAL_CTA_CONTENT.title}
                            </h2>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                                Stop letting anyone message you anything. Take control of your professional access.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10"
                            >
                                <h3 className="text-sm font-bold uppercase tracking-wider text-red-600 mb-6 flex items-center gap-2">
                                    <X className="w-4 h-4" /> Before OpenDM
                                </h3>
                                <ul className="space-y-3">
                                    {FINAL_CTA_CONTENT.replaces.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-red-900/70 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/40 mt-1.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10"
                            >
                                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-6 flex items-center gap-2">
                                    <Check className="w-4 h-4" /> With OpenDM
                                </h3>
                                <ul className="space-y-3">
                                    {FINAL_CTA_CONTENT.provides.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-emerald-900/70 font-medium">
                                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="pt-4"
                        >
                            <Button size="lg" className="h-16 px-10 text-xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all group" asChild>
                                <Link href={isAuthenticated ? "/dashboard" : "/sign-up"}>
                                    {isLoading ? "Loading..." : FINAL_CTA_CONTENT.cta} <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <p className="mt-4 text-sm text-muted-foreground font-medium">
                                Start for free. No credit card required.
                            </p>
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 text-center"
                >
                    <p className="text-xl font-bold text-muted-foreground/60 tracking-tight">
                        Your Professional & Personal Contact Page, Structured.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
