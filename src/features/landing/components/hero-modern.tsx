"use client";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { HERO_CONTENT } from "../constants/landing-content";
import Hyperspeed from "@/components/visuals/Hyperspeed";
import { Typography } from "@/components/ui/typography";

export function HeroModern() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [handle, setHandle] = useState("");

  return (
    <section className="relative w-full py-20 sm:py-32 flex flex-col items-center justify-center overflow-hidden min-h-[80vh]">
      <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20 items-center">
          {/* Content Left */}
          <div className="flex flex-col col-span-2 items-start text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="heading">{HERO_CONTENT.title}</Typography>
            </motion.div>

            <Typography
              as={motion.p}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              variant="subheading"
              className="max-w-2xl text-muted-foreground text-2xl md:text-3xl"
            >
              Share one link everywhere to{" "}
              <span className="font-bold">capture</span> inquiries,{" "}
              <span className="font-bold">route</span> them to your inbox, block
              spam, and enable <span className="font-bold">paid DMs</span> for
              priority access.
            </Typography>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full col-span-1"
            >
              {isAuthenticated ? (
                <Button size="lg" className="h-14 px-8 text-lg" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <div className="flex w-full lg:max-w-md mx-auto lg:mx-0 bg-muted/50 border border-border rounded-full focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <div className="relative flex-1 flex items-center">
                    <span className="pl-4 text-muted-foreground whitespace-nowrap">
                      opendm.io/
                    </span>
                    <input
                      placeholder="handle"
                      className="h-12 w-full pl-1 bg-transparent border-none focus:ring-0 focus:outline-none text-lg"
                      value={handle}
                      onChange={(e) =>
                        setHandle(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ""),
                        )
                      }
                    />
                  </div>

                  <Button
                    size="lg"
                    className="h-12 px-8 text-lg rounded-full shadow-sm transition-all shrink-0"
                    disabled={isLoading}
                    asChild
                  >
                    <Link href={`/sign-up?handle=${handle}`}>
                      {isLoading ? "Loading..." : HERO_CONTENT.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Preview Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full"
          >
            <div className="relative aspect-4/3 rounded-3xl border border-border bg-muted/20 flex flex-col items-center justify-center overflow-hidden shadow-2xl group transition-all duration-500 hover:border-primary/50">
              <div className="absolute inset-0 bg-white group-hover:opacity-100 transition-opacity" />
              <div className="text-center space-y-4 relative z-10 px-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <ImageIcon />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
