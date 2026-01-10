import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { Typography } from "@/components/ui/typography";
import { PlanCard } from "@/features/subscription/components/plan-card";
import { getAllPlans } from "@/features/subscription/config/plan-config";
import { BillingCycle } from "@/features/subscription/types/subscription-types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function PricingModern() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
    const plans = getAllPlans();

    return (
        <section id="pricing" className="relative w-full py-24 sm:py-32 overflow-hidden bg-background">
            <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16 space-y-4"
                >
                    <Typography variant="heading">
                        Simple, transparent pricing
                    </Typography>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Label className="text-sm">Monthly</Label>
                        <Switch
                            checked={billingCycle === "annual"}
                            onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
                        />
                        <Label className="text-sm">
                            Annual
                            <span className="ml-2 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Save 17%</span>
                        </Label>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
                    {plans
                        .filter(p => p.id !== 'free')
                        .sort((a, b) => {
                            const order = ['beginner', 'pro', 'max'];
                            return order.indexOf(a.id) - order.indexOf(b.id);
                        })
                        .map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="h-full"
                            >
                                <PlanCard
                                    plan={plan}
                                    billingCycle={billingCycle}
                                    footer={
                                        <Button
                                            size="lg"
                                            className={`w-full h-12 text-base transition-all ${plan.ui.popular
                                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                : "bg-background text-foreground hover:bg-muted border border-border"
                                                }`}
                                            disabled={isLoading}
                                            asChild
                                        >
                                            <Link href={isAuthenticated ? "/dashboard" : "/auth/register"}>
                                                {isLoading ? "Loading..." : isAuthenticated ? "Go to Dashboard" : plan.ui.cta || "Get Started"}
                                                <ArrowRight className="ml-2 w-4 h-4" />
                                            </Link>
                                        </Button>
                                    }
                                />
                            </motion.div>
                        ))}
                </div>

                {plans.filter(p => p.id === 'free').map((plan) => (
                    <motion.div
                        key="free-tier"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="p-8 rounded-[2rem] border border-border bg-card/50 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm">
                            <div className="space-y-4 text-center md:text-left">
                                <Typography variant="subheading" className="text-primary font-bold">
                                    {plan.name}
                                </Typography>
                                <Typography variant="body" className="max-w-lg">
                                    {plan.description}
                                </Typography>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    {plan.ui.displayFeatures?.slice(0, 3).map((feature, fIndex) => (
                                        <div key={fIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="w-1 h-1 rounded-full bg-primary/40" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 px-10 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary transition-all group shrink-0"
                                asChild
                            >
                                <Link href={isAuthenticated ? "/dashboard" : "/auth/register"}>
                                    {isAuthenticated ? "Go to Dashboard" : "Start for Free"}
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section >
    );
}
