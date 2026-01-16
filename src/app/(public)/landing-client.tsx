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
    restDelta: 0.001,
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

      {/* Content wrapper with fadeIn */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10"
      >
        <HeroModern />

        <Testimonials />

        <HowItWorksNew />

        <FeaturesNew />

        <WhyChoose />

        <Faq />

        <PricingModern />

        <FinalCTA />
      </motion.div>
    </main>
  );
}
