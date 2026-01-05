"use client";

import { motion } from "framer-motion";
import { ACTUALLY_WORK_CONTENT } from "../constants/landing-content";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";

export function ActuallyWork() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <section className="relative w-full py-24 bg-muted/30 overflow-hidden">
      {/* Subtle Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-[0.05] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Typography variant="h2" className="md:text-5xl text-3xl border-none mb-4">
            {ACTUALLY_WORK_CONTENT.title}
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ACTUALLY_WORK_CONTENT.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-background border border-border hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <Typography variant="h4" as="h3" className="mb-3">{item.title}</Typography>
                <Typography variant="muted" className="leading-relaxed">
                  {item.description}
                </Typography>
              </motion.div>
            );
          })}
        </div>

        {!isAuthenticated && (
          <div className="mt-16 text-center">
            <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-lg group" asChild>
              <Link href="/sign-up">
                Get started for free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
