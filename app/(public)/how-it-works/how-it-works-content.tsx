"use client";

import { motion } from "framer-motion";
import {
    Link as LinkIcon,
    MousePointerClick,
    Inbox,
    CheckCircle2,
    ArrowRight,
    Search,
    Zap,
    Globe
} from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STEPS = [
    {
        number: "01",
        title: "Create Your Gateway",
        description: "Set up your professional profile in minutes. Choose your custom handle (opendm.io/yourname) and define your intake categories.",
        icon: LinkIcon,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        points: ["Choose custom handle", "Define inquiry types", "Set qualification logic"]
    },
    {
        number: "02",
        title: "Share Everywhere",
        description: "Add your link to your social media bios, email signature, or embed it directly on your professional website.",
        icon: MousePointerClick,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        points: ["Bio link integration", "Smart website embed", "Custom domain hosting"]
    },
    {
        number: "03",
        title: "Manage & Monetize",
        description: "Receive qualified, structured inquiries in your unified inbox. Enable paid access for priority requests.",
        icon: Inbox,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        points: ["Structured inquiries", "Priority paid DMs", "Centralized lead CRM"]
    }
];

const COMPARISON = [
    {
        feature: "Qualification",
        traditional: "None - anyone can email anything",
        opendm: "Structured intent-based intake logic"
    },
    {
        feature: "Spam Control",
        traditional: "Passive - filters catch some, miss many",
        opendm: "Active - proactive logic deters bots"
    },
    {
        feature: "Monetization",
        traditional: "Manual - manual invoicing & chasing",
        opendm: "Built-in - pay before the conversation"
    },
    {
        feature: "Organization",
        traditional: "Scattered - messy email threads",
        opendm: "Centralized - dedicated inbound CRM"
    }
];

export function HowItWorksContent() {
    return (
        <div className="relative w-full">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
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
                                <Search className="w-4 h-4 mr-2" />
                                How It Works
                            </div>
                            <Typography variant="h1" className="md:text-6xl text-4xl mb-6">
                                From First Impression to Final Agreement
                            </Typography>
                            <Typography variant="lead" className="text-lg md:text-xl text-muted-foreground mb-10">
                                OpenDM redefines how you handle inbound communication. It&apos;s a three-step journey to a cleaner, more profitable inbox.
                            </Typography>
                        </motion.div>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-16 sm:py-24">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            {/* Connection Lines (Desktop) */}
                            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-px border-t border-dashed border-border" />

                            {STEPS.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7, delay: index * 0.2 }}
                                    className="relative flex flex-col items-center text-center space-y-6"
                                >
                                    <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center relative z-10 shadow-lg transition-transform hover:scale-110", step.bg)}>
                                        <step.icon className={cn("w-10 h-10", step.color)} />
                                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                                            {step.number}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Typography variant="h3" className="text-2xl font-bold">{step.title}</Typography>
                                        <Typography variant="muted" className="text-base leading-relaxed">
                                            {step.description}
                                        </Typography>
                                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                                            {step.points.map((point, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-muted/50 text-xs font-semibold text-muted-foreground border border-border/50">
                                                    {point}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* The Transition Section (Before/After) */}
                <section className="py-24 sm:py-32 bg-muted/30">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <Typography variant="h2" className="text-3xl md:text-5xl border-none mb-4">
                                Why Professionals Are Switching
                            </Typography>
                            <Typography variant="lead" className="max-w-2xl mx-auto">
                                The traditional contact form is broken. OpenDM is the modern solution for high-volume professionals.
                            </Typography>
                        </div>

                        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-border shadow-2xl bg-background">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="p-6 font-bold text-lg">Feature</th>
                                        <th className="p-6 font-bold text-lg text-muted-foreground">Traditional Forms</th>
                                        <th className="p-6 font-bold text-lg text-primary">OpenDM Gateway</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON.map((row, index) => (
                                        <tr key={index} className="border-t border-border hover:bg-muted/20 transition-colors">
                                            <td className="p-6 font-semibold">{row.feature}</td>
                                            <td className="p-6 text-muted-foreground">{row.traditional}</td>
                                            <td className="p-6 font-medium flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                                {row.opendm}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Implementation Paths */}
                <section className="py-24 sm:py-32">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <Typography variant="h2" className="text-3xl md:text-5xl border-none">
                                    One System. <br />Two Implementation Paths.
                                </Typography>
                                <Typography className="text-lg text-muted-foreground">
                                    Whether you want a standalone professional profile or a powerful intake layer for your existing site, OpenDM adapts to your needs.
                                </Typography>

                                <div className="space-y-6">
                                    <div className="flex gap-6 p-6 rounded-2xl border border-border hover:border-primary/30 transition-all bg-background group">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Globe className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <Typography variant="h4" className="mb-2">Public Inbound Profile</Typography>
                                            <Typography variant="muted">Use your OpenDM link as your primary contact handle across social media and your bio.</Typography>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 p-6 rounded-2xl border border-border hover:border-primary/30 transition-all bg-background group">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <Zap className="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <Typography variant="h4" className="mb-2">Smart Website Embed</Typography>
                                            <Typography variant="muted">Drop our widget into your site to replace generic forms with intelligent qualification logic.</Typography>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                {/* Visual representation of implementation */}
                                <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-muted to-background border border-border shadow-2xl overflow-hidden p-8 flex flex-col justify-end gap-4 relative">
                                    <div className="absolute inset-0 bg-primary/5 pattern-grid opacity-20" />
                                    <div className="relative z-10 p-6 rounded-2xl bg-background border border-border shadow-lg">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/20" />
                                            <div className="space-y-1">
                                                <div className="w-24 h-2 bg-muted rounded-full" />
                                                <div className="w-32 h-2 bg-muted/50 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="w-full h-8 bg-primary/10 rounded-lg flex items-center px-4">
                                                <div className="w-16 h-2 bg-primary/40 rounded-full" />
                                            </div>
                                            <div className="w-full h-8 bg-muted/50 rounded-lg" />
                                            <div className="w-full h-8 bg-muted/50 rounded-lg" />
                                        </div>
                                    </div>
                                    <div className="relative z-10 p-4 rounded-xl bg-foreground text-background flex items-center justify-between">
                                        <span className="text-sm font-bold tracking-tight">opendm.io/sarah_jones</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 sm:py-32">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="bg-primary/5 rounded-[3rem] p-12 md:p-24 border border-primary/10 text-center relative overflow-hidden">
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50" />

                            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                                <Typography variant="h2" className="text-4xl md:text-5xl font-bold border-none">
                                    Ready to Build Your Professional Gateway?
                                </Typography>
                                <Typography variant="lead" className="text-muted-foreground">
                                    Take back control of your inbound. Start your 14-day Pro trial today.
                                </Typography>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                                    <Button size="lg" asChild className="rounded-full px-12 h-14 text-lg">
                                        <Link href="/sign-up">Start Building Now</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild className="rounded-full px-12 h-14 text-lg">
                                        <Link href="/">Back to Home</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
