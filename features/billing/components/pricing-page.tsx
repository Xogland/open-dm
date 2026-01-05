"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useUserData } from "@/features/organization/providers/user-data-provider";

export default function PricingPage() {
    const { selectedOrganization } = useUserData();
    const subscriptionStatus = useQuery(
        api.subscription.checkSubscriptionStatus,
        {
            organisationId: selectedOrganization._id,
        },
    );
    const updateSubscription = useMutation(
        api.subscription.debugUpdateSubscription,
    );

    const handleSubscribe = async (planId: string) => {
        try {
            await updateSubscription({ planId: planId });
            toast.success(`Subscribed to ${planId} plan`);
        } catch (error) {
            toast.error("Failed to update subscription");
            console.error(error);
        }
    };

    const plans = [
        {
            id: "free",
            name: "Free",
            price: "$0",
            description: "For individuals just starting out",
            features: ["1 Organization", "1 Form", "Basic Analytics"],
        },
        {
            id: "pro",
            name: "Pro",
            price: "$3.99",
            description: "For growing teams",
            features: [
                "Unlimited Organizations",
                "3 Forms",
                "Advanced Analytics",
                "Priority Support",
            ],
            popular: true,
        },
        {
            id: "business",
            name: "Business",
            price: "$14.99",
            description: "For large enterprises",
            features: [
                "Unlimited Organizations",
                "5 Forms",
                "Custom Integrations",
                "Dedicated Account Manager",
                "SLA",
            ],
        },
    ];

    if (!subscriptionStatus) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-4 tracking-tight"
                >
                    Simple, Transparent Pricing
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-lg max-w-2xl mx-auto"
                >
                    Choose the plan that's right for you. No hidden fees, cancel anytime.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => {
                    const isCurrentPlan = subscriptionStatus.plan_id === plan.id;
                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                        >
                            <Card
                                className={`flex flex-col h-full relative transition-all duration-200 hover:shadow-lg ${isCurrentPlan
                                    ? "border-primary border-2 shadow-md"
                                    : plan.popular
                                        ? "border-primary/50 shadow-sm"
                                        : ""
                                    }`}
                            >
                                {plan.popular && !isCurrentPlan && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                                        MOST POPULAR
                                    </div>
                                )}
                                {isCurrentPlan && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                                        CURRENT PLAN
                                    </div>
                                )}

                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="text-4xl font-bold mb-6">
                                        {plan.price}
                                        <span className="text-base font-normal text-muted-foreground">
                                            /month
                                        </span>
                                    </div>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center text-sm">
                                                <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    {isCurrentPlan ? (
                                        <Button className="w-full" variant="outline" disabled>
                                            Current Plan
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full"
                                            onClick={() => handleSubscribe(plan.id)}
                                            variant={plan.popular ? "default" : "outline"}
                                        >
                                            {plan.id === "free" ? "Downgrade" : "Subscribe"}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
