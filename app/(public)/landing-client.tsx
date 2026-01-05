"use client";

import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import { HeroModern } from "@/features/landing/components/hero-modern";
import { Testimonials } from "@/features/landing/components/testimonials";
import { HowItWorksNew } from "@/features/landing/components/how-it-works";
import { FeaturesNew } from "@/features/landing/components/features";
import { WhyChoose } from "@/features/landing/components/why-choose";
import { Faq } from "@/features/landing/components/faq";
import { PricingModern } from "@/features/landing/components/pricing";
import { FinalCTA } from "@/features/landing/components/final-cta";

export function LandingClient() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 600); // Center the 1200px spotlight
            mouseY.set(e.clientY - 600);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <main className="relative w-full min-h-screen flex flex-col overflow-x-hidden selection:bg-primary/20 bg-background">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 to-primary z-[100] origin-left"
                style={{ scaleX }}
            />

            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.03] mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Mouse Spotlight */}
                <motion.div
                    className="absolute w-[1200px] h-[1200px] opacity-[0.08] bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]"
                    style={{
                        x: mouseX,
                        y: mouseY,
                    }}
                />

                {/* Floating Orbs */}
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        x: [0, 20, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] -left-[10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px]"
                />

                <motion.div
                    animate={{
                        y: [0, 60, 0],
                        x: [0, -30, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[20%] -right-[10%] w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[140px]"
                />

                {/* Subtle Grid with Fade */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)]" />
            </div>

            {/* Content wrapper with fadeIn */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10"
            >
                <HeroModern />

                <div className="relative bg-muted/40">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                    <Testimonials />
                </div>

                <div className="relative bg-background">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                    <HowItWorksNew />
                </div>

                <div className="relative bg-muted/40">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                    <FeaturesNew />
                </div>

                <div className="relative bg-background">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                    <WhyChoose />
                </div>

                <div className="relative bg-muted/40">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                    <Faq />
                </div>

                <div className="relative bg-background">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                    <PricingModern />
                </div>

                <div className="relative bg-muted/40">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                    <FinalCTA />
                </div>
            </motion.div>
        </main>
    );
}
