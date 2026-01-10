"use client";

import { motion } from "framer-motion";
import { ListChecks, Route, UserSquare2, DollarSign, ArrowRight } from "lucide-react";
import { BETTER_WAY_CONTENT } from "../constants/landing-content";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Typography } from "@/components/ui/typography";

export function BetterWay() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden bg-background">
      {/* Subtle Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b44ff 0%, transparent 70%)' }} />
      <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Typography variant="h2" className="md:text-5xl text-3xl border-none mb-4">
            {BETTER_WAY_CONTENT.title}
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BETTER_WAY_CONTENT.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 md:p-10 rounded-[2rem] bg-muted/30 border border-border hover:bg-card hover:shadow-xl transition-all duration-300 h-full flex flex-col"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>

                <Typography variant="h3" as="h3" className="text-2xl border-none pb-0 mb-4">{feature.title}</Typography>

                <Typography variant="muted" className="leading-relaxed mb-6">
                  {feature.description}
                </Typography>

                <Typography variant="small" className="text-foreground/80 mb-4 bg-background/50 p-4 rounded-xl border border-border/50">
                  {feature.sub}
                </Typography>

                {feature.useCases && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {feature.useCases.map((useCase, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">
                        {useCase}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {!isAuthenticated && (
          <div className="mt-20 text-center">
            <Button size="lg" className="h-14 px-8 text-lg shadow-lg group" asChild>
              <Link href="/sign-up">
                Claim your name <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
