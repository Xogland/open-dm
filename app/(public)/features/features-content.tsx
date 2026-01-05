"use client";

import { motion } from "framer-motion";
import {
    Route,
    DollarSign,
    UserSquare2,
    Globe,
    Zap,
    ShieldCheck,
    Target,
    Layers,
    Workflow,
    Check
} from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CORE_FEATURES = [
    {
        title: "Intelligent Inquiry Routing",
        description: "Don't just collect emails. Qualify them. OpenDM's logic-based routing ensures you only see messages that matter.",
        icon: Route,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        details: [
            "Custom path for every inquiry type",
            "Logic-based followup questions",
            "Automatic lead qualification",
            "Direct routing to specific team members"
        ]
    },
    {
        title: "Priority Monetization",
        description: "Value your time. Set up paid DM channels for consultations, advice, or priority support with 0% platform fees.",
        icon: DollarSign,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        details: [
            "Instant Stripe integration",
            "Custom pricing for different intents",
            "No platform fee on your earnings",
            "Refund & dispute management"
        ]
    },
    {
        title: "Unified Inbound CRM",
        description: "Every conversation has a home. Track your history, notes, and client context in one centralized workspace.",
        icon: UserSquare2,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        details: [
            "Complete contact history",
            "Source & campaign tracking",
            "Internal collaboration notes",
            "Client relationship tagging"
        ]
    }
];

const EXTENDED_FEATURES = [
    {
        title: "Custom Branded Domains",
        description: "Host your contact portal on contact.yourbrand.com for a seamless professional experience.",
        icon: Globe
    },
    {
        title: "Team Workspaces",
        description: "Invite your team, assign roles, and collaborate on inquiries without sharing passwords.",
        icon: Layers
    },
    {
        title: "Workflow Automation",
        description: "Connect with 5,000+ apps via Zapier or use our native integrations for Slack and Discord.",
        icon: Workflow
    },
    {
        title: "Smart Spam Filtering",
        description: "Our AI-powered filter catches 99.9% of bots and low-quality outreach before it hits your inbox.",
        icon: ShieldCheck
    },
    {
        title: "Conversion Analytics",
        description: "Understand where your best leads come from with detailed source and conversion tracking.",
        icon: Target
    },
    {
        title: "Instant Set-up",
        description: "Get your professional link live in under 5 minutes with our pre-built industry templates.",
        icon: Zap
    }
];

export function FeaturesContent() {
    return (
        <div className="relative w-full">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="py-24 sm:py-32 overflow-hidden">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium">
                                <Zap className="w-4 h-4 mr-2" />
                                Powerful Feature Set
                            </div>
                            <Typography variant="h1" className="md:text-6xl text-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                                Features Built for Serious Professionals
                            </Typography>
                            <Typography variant="lead" className="text-lg md:text-xl text-muted-foreground mb-10">
                                OpenDM is more than a contact form. It&apos;s an intelligent intake layer that qualifies, routes, and monetizes your inbound conversations.
                            </Typography>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button size="lg" asChild className="rounded-full px-8">
                                    <Link href="/sign-up">Start Free Trial</Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild className="rounded-full px-8">
                                    <Link href="/how-it-works">See How it Works</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Core Pillars Section */}
                <section className="py-16 sm:py-24 bg-muted/30">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-12 lg:gap-24">
                            {CORE_FEATURES.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: index * 0.1 }}
                                    className={cn(
                                        "flex flex-col lg:flex-row items-center gap-12",
                                        index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                    )}
                                >
                                    <div className="flex-1 space-y-6">
                                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", feature.bg)}>
                                            <feature.icon className={cn("w-8 h-8", feature.color)} />
                                        </div>
                                        <Typography variant="h2" className="text-3xl md:text-4xl border-none">
                                            {feature.title}
                                        </Typography>
                                        <Typography className="text-lg text-muted-foreground leading-relaxed">
                                            {feature.description}
                                        </Typography>
                                        <ul className="space-y-4 pt-4">
                                            {feature.details.map((detail, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", feature.bg)}>
                                                        <Check className={cn("w-3 h-3", feature.color)} />
                                                    </div>
                                                    <span className="text-foreground/80 font-medium">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex-1 w-full aspect-video bg-muted/50 rounded-3xl border border-border/50 shadow-xl relative overflow-hidden group">
                                        {/* Placeholder for feature visual */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent flex items-center justify-center">
                                            <feature.icon className={cn("w-24 h-24 opacity-20 group-hover:scale-110 transition-transform duration-500", feature.color)} />
                                        </div>
                                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Typography variant="small" className="font-bold tracking-widest uppercase">Feature Detail View</Typography>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Capability Grid */}
                <section className="py-24 sm:py-32">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="text-center mb-16 space-y-4">
                            <Typography variant="h2" className="text-3xl md:text-5xl border-none">
                                Everything You Need for Global Outreach
                            </Typography>
                            <Typography variant="lead" className="max-w-2xl mx-auto">
                                We&apos;ve thought of everything to make your professional communication seamless and secure.
                            </Typography>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {EXTENDED_FEATURES.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    className="p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <Typography variant="h4" className="mb-3">{feature.title}</Typography>
                                    <Typography variant="muted" className="leading-relaxed">
                                        {feature.description}
                                    </Typography>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Embed & Integrations (Coming Soon) Section */}
                <section className="py-24 bg-primary/5 border-y border-primary/10">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 space-y-8">
                                <Typography variant="h2" className="text-3xl md:text-4xl border-none">
                                    Embed Anywhere, Scale Everywhere
                                </Typography>
                                <Typography className="text-lg text-muted-foreground">
                                    Your professional contact gateway isn&apos;t just a link. It&apos;s a component you can take with you across the entire web.
                                </Typography>
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-background/50 border border-border/50">
                                        <Typography variant="h4" className="flex items-center gap-2">
                                            WordPress Plugin <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Coming Soon</span>
                                        </Typography>
                                        <Typography variant="muted" className="mt-2 italic">
                                            Native widget for any WordPress site, maintaining your design while adding powerful capture tools.
                                        </Typography>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-background/50 border border-border/50">
                                        <Typography variant="h4" className="flex items-center gap-2">
                                            React & Next.js Components <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Coming Soon</span>
                                        </Typography>
                                        <Typography variant="muted" className="mt-2 italic">
                                            Drop a fully-functional contact widget into your modern web apps with full styling control.
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 relative">
                                <div className="relative z-10 p-2 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
                                    <Globe className="w-48 h-48 text-primary/20 animate-pulse" />
                                </div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-bounce duration-5000" />
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-bounce delay-1000 duration-5000" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 sm:py-32">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="relative rounded-[3rem] bg-foreground text-background p-12 md:p-24 overflow-hidden border border-border">
                            {/* Decorative background for CTA */}
                            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

                            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
                                <Typography variant="h2" className="text-4xl md:text-6xl font-bold tracking-tight border-none text-white">
                                    Stop Losing Leads to Cluttered Inboxes
                                </Typography>
                                <Typography className="text-lg md:text-xl text-white/70">
                                    Join thousands of professionals who have reclaimed their time and turned their contact link into a business asset.
                                </Typography>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                                    <Button size="lg" asChild className="rounded-full px-12 bg-white text-black hover:bg-white/90 h-14 text-lg">
                                        <Link href="/sign-up">Get Started Free</Link>
                                    </Button>
                                    <Typography variant="small" className="text-white/50">
                                        No credit card required. 14-day Pro trial.
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
