"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { PRICING_PLANS } from "../constants/landing-content";

export function PricingModern() {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <section id="pricing" className="relative w-full py-24 sm:py-32 overflow-hidden">
            <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        Start Your Free Trial Today
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {PRICING_PLANS.map((tier, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative h-full"
                        >
                            <div
                                className={`h-full p-8 rounded-3xl border transition-all duration-300 flex flex-col ${tier.popular
                                    ? "bg-primary text-primary-foreground shadow-2xl border-primary scale-[1.05] z-10"
                                    : "bg-card border-border hover:shadow-lg"
                                    }`}
                            >
                                <div className="mb-8">
                                    <h3 className={`text-lg font-bold uppercase tracking-wide mb-2 ${tier.popular ? "text-primary-foreground/80" : "text-primary"}`}>
                                        {tier.name.split(" — ")[0]}
                                    </h3>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-4xl font-bold">${tier.price}</span>
                                        <span className={`text-sm ${tier.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>/{tier.period.split(" ")[0]}</span>
                                    </div>
                                    <p className={`text-sm font-medium ${tier.popular ? "text-primary-foreground/90" : "text-foreground/80"}`}>
                                        {tier.name.split(" — ")[1]}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    {tier.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-3">
                                            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.popular ? "text-primary-foreground" : "text-primary"}`} />
                                            <span className="text-sm font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    size="lg"
                                    className={`w-full h-12 text-base font-bold transition-all ${tier.popular
                                        ? "bg-background text-foreground hover:bg-background/90"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                        }`}
                                    disabled={isLoading}
                                    asChild
                                >
                                    <Link href={isAuthenticated ? "/dashboard" : "/sign-up"}>
                                        {isLoading ? "Loading..." : isAuthenticated ? "Go to Dashboard" : tier.cta}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
