"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "../constants/landing-content";
import { Star } from "lucide-react";
import { Typography } from "@/components/ui/typography";

export function Testimonials() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center">
          <div className="text-center">
            <Typography variant="heading" className="mt-4 text-gray-900">
              Beta User Feedback
            </Typography>
          </div>

          <div className="relative mt-10 md:mt-24">
            {/* Gradient Backdrop */}
            <div className="absolute -inset-x-1 inset-y-16 md:-inset-x-2 md:-inset-y-6">
              <div
                className="w-full h-full mx-auto rounded-3xl opacity-30 blur-lg filter"
                style={{
                  background:
                    "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)",
                  opacity: 0.15,
                }}
              />
            </div>

            <div className="relative grid max-w-lg grid-cols-1 gap-6 mx-auto md:max-w-none lg:gap-10 md:grid-cols-2">
              {TESTIMONIALS.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200"
                >
                  <div className="flex flex-col justify-between flex-1 p-6 bg-white lg:py-8 lg:px-7">
                    <div className="flex-1">
                      <blockquote className="flex-1">
                        <Typography variant="body" className="text-gray-700 italic">
                          “{testimonial.quote}”{" "}
                          <span className="leading-0 font-bold">
                            {" "}
                            - {testimonial.author}
                          </span>
                        </Typography>
                      </blockquote>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
