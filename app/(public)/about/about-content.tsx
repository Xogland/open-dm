"use client";

import { motion } from "framer-motion";
import {
    Shield,
    GitMerge,
    Scale,
    Users,
    Mail,
    Zap,
    MessageSquare,
    ArrowRight
} from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SOLUTIONS = [
    {
        title: "The Noise Problem",
        description: "Unstructured DMs and emails lead to 'hey' messages without context, wasting hours of your week.",
        icon: MessageSquare,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "The Value Gap",
        description: "Professionals often give away their expertise for free because there's no easy way to gate their time.",
        icon: Scale,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        title: "Spam & Bots",
        description: "Generic contact forms are magnets for spam. We use intelligent qualification to keep them out.",
        icon: Shield,
        color: "text-red-500",
        bg: "bg-red-500/10"
    },
    {
        title: "Complexity Bloat",
        description: "CRMs are too heavy. Email is too messy. OpenDM is the perfect middle ground.",
        icon: Zap,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    }
];

const VALUES = [
    {
        title: "Privacy First",
        description: "Your email and personal data are never exposed publicly. We facilitate the conversation without compromising your security.",
        icon: Shield,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        title: "Structured Flow",
        description: "Every inquiry comes with the exact information you need to make a decision. No more back-and-forth just to get the basics.",
        icon: GitMerge,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "Fair Value",
        description: "We believe in the value of your expertise. That's why we take 0% platform fees on your paid messages.",
        icon: Scale,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    }
];

export function AboutContent() {
    return (
        <div className="relative w-full overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[5%] right-[5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="py-24 sm:py-32">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm">
                                <Users className="w-4 h-4 mr-2" />
                                About OpenDM
                            </div>
                            <Typography variant="h1" className="md:text-6xl text-4xl mb-8">
                                Transforming How the World <br className="hidden md:block" />
                                <span className="text-primary">Handles Inbound Communication</span>
                            </Typography>
                            <Typography variant="lead" className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                                We&apos;re on a mission to bridge the gap between high-volume inbound communication and meaningful human connection.
                            </Typography>
                        </motion.div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 sm:py-24">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Typography variant="h2" className="text-3xl md:text-4xl mb-6 border-none">Our Mission</Typography>
                                <div className="space-y-6 text-lg text-muted-foreground">
                                    <p>
                                        OpenDM was built with a clear purpose: to bridge the gap between high-volume inbound communication and meaningful human connection. We believe that professionals, creators, and businesses deserve a &quot;front door&quot; that works for them, not against them.
                                    </p>
                                    <p>
                                        In an era of endless noise, OpenDM provides the signal. Our platform empowers you to structure inquiries, qualify leads, and protect your most valuable asset—your time.
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-muted/50 to-background border border-border/50 shadow-2xl p-8 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
                                    <div className="relative z-10 w-full max-w-sm bg-background rounded-xl border border-border shadow-xl p-6 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Mail className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                                                <div className="h-3 w-16 bg-muted/50 rounded mt-2 animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-full bg-muted/30 rounded animate-pulse" />
                                            <div className="h-4 w-5/6 bg-muted/30 rounded animate-pulse" />
                                            <div className="h-4 w-4/6 bg-muted/30 rounded animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Abstract shapes */}
                                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* What We Solve Section */}
                <section className="py-24 sm:py-32 bg-muted/30">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <Typography variant="h2" className="text-3xl md:text-5xl border-none mb-4">
                                What We Solve
                            </Typography>
                            <Typography variant="lead" className="max-w-2xl mx-auto text-muted-foreground">
                                Traditional channels are broken. We fixed them.
                            </Typography>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {SOLUTIONS.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-8 rounded-2xl bg-background border border-border hover:border-primary/20 hover:shadow-lg transition-all group"
                                >
                                    <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", item.bg)}>
                                        <item.icon className={cn("w-7 h-7", item.color)} />
                                    </div>
                                    <Typography variant="h3" className="text-xl mb-3">{item.title}</Typography>
                                    <Typography variant="body" className="text-muted-foreground">
                                        {item.description}
                                    </Typography>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 sm:py-32">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                            <div className="sticky top-24">
                                <Typography variant="h2" className="text-3xl md:text-5xl border-none mb-6">
                                    Our Core Values
                                </Typography>
                                <Typography variant="lead" className="text-muted-foreground mb-8">
                                    We build for trust, transparency, and clarity. These principles guide every feature we ship.
                                </Typography>
                                <Button size="lg" asChild className="rounded-full">
                                    <Link href="/sign-up">Start Your Journey <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                </Button>
                            </div>

                            <div className="space-y-8">
                                {VALUES.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className="flex gap-6 p-6 rounded-2xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all"
                                    >
                                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", item.bg)}>
                                            <item.icon className={cn("w-6 h-6", item.color)} />
                                        </div>
                                        <div>
                                            <Typography variant="h3" className="text-xl mb-2">{item.title}</Typography>
                                            <Typography variant="body" className="text-muted-foreground leading-relaxed">
                                                {item.description}
                                            </Typography>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 sm:py-32 mb-12">
                    <div className="container px-4 mx-auto max-w-7xl">
                        <div className="bg-primary/5 rounded-[3rem] p-12 md:p-24 border border-primary/10 text-center relative overflow-hidden">
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-50" />

                            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                                <Typography variant="h2" className="text-4xl md:text-5xl border-none">
                                    Ready to Reclaim Your Inbox?
                                </Typography>
                                <Typography variant="lead" className="text-muted-foreground">
                                    Join thousands of professionals who trust OpenDM to manage their inbound communications.
                                </Typography>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                                    <Button size="lg" asChild className="rounded-full px-12 h-14 text-lg">
                                        <Link href="/sign-up">Get Started</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild className="rounded-full px-12 h-14 text-lg">
                                        <Link href="/features">Explore Features</Link>
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
