"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FAQS } from "../constants/landing-content";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden">
      <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Typography variant="heading" className="mb-4">
            Frequently Asked Questions
          </Typography>
        </motion.div>

        <div>
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
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
                    {faq.question}
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
                        <Typography
                          variant="lead"
                          className="text-foreground/80"
                        >
                          {faq.answer}
                        </Typography>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
