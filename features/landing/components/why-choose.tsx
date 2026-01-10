"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Plus } from "lucide-react";
import { WHY_CHOOSE_CONTENT } from "../constants/landing-content";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";

export function WhyChoose() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden">
      <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >
          <div className="space-y-6 text-center">
            <Typography variant="heading">
              {WHY_CHOOSE_CONTENT.title}
            </Typography>
            <div className="space-y-4 text-center italic">
              <Typography variant="lead">
                <span className="text-2xl">{WHY_CHOOSE_CONTENT.subTitle}</span>
              </Typography>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full"
          >
            <div className="relative h-150 rounded-3xl border border-border bg-muted/20 flex flex-col items-center justify-center overflow-hidden shadow-2xl group transition-all duration-500 hover:border-primary/50">
              <div className="absolute inset-0 bg-white group-hover:opacity-100 transition-opacity" />
              <div className="text-center space-y-4 relative z-10 px-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <ImageIcon />
                </div>
              </div>
            </div>
          </motion.div>
          <div className="space-y-0 border-t border-border">
            {WHY_CHOOSE_CONTENT.items.map((item: any, index: number) => {
              const isOpen = openIndex === index;
              // Strip trailing " +" from the title
              const displayTitle = item.title.replace(/\s*\+\s*$/, "");

              return (
                <div key={index} className="border-b border-border">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full py-6 md:py-8 flex items-center justify-between text-left group transition-all"
                  >
                    <Typography
                      variant="subheading"
                      as="h3"
                      className={cn(
                        "md:text-2xl transition-colors pr-4",
                        isOpen
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      {displayTitle}
                    </Typography>
                    <div
                      className={cn(
                        "transition-all duration-300 flex-shrink-0",
                        isOpen
                          ? "rotate-45 text-primary"
                          : "rotate-0 text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <Plus className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 space-y-6">
                          <Typography variant="lead" className="text-foreground/80">
                            {item.description}
                          </Typography>
                          {item.link && (
                            <a
                              href={item.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary hover:underline"
                            >
                              {item.link.label} @{" "}
                              {item.link.url.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div >
    </section >
  );
}
