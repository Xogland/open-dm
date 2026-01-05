"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "../constants/landing-content";
import { Star } from "lucide-react";

export function Testimonials() {
    return (
        <section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center">
                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-600">2,157+ professionals have said how good OpenDM is</p>
                        <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl">Our happy clients say about us</h2>
                    </div>

                    <div className="relative mt-10 md:mt-24">
                        {/* Gradient Backdrop */}
                        <div className="absolute -inset-x-1 inset-y-16 md:-inset-x-2 md:-inset-y-6">
                            <div
                                className="w-full h-full max-w-5xl mx-auto rounded-3xl opacity-30 blur-lg filter"
                                style={{ background: 'linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)' }}
                            />
                        </div>

                        <div className="relative grid max-w-lg grid-cols-1 gap-6 mx-auto md:max-w-none lg:gap-10 md:grid-cols-2 lg:grid-cols-4">
                            {TESTIMONIALS.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex flex-col overflow-hidden shadow-xl rounded-2xl"
                                >
                                    <div className="flex flex-col justify-between flex-1 p-6 bg-white lg:py-8 lg:px-7">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 text-[#FDB241] fill-current" />
                                                ))}
                                            </div>

                                            <blockquote className="flex-1 mt-8">
                                                <p className="text-lg leading-relaxed text-gray-900 italic">
                                                    “{testimonial.quote}”
                                                </p>
                                            </blockquote>
                                        </div>

                                        <div className="flex items-center mt-8 pt-6 border-t border-gray-100">
                                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">
                                                {testimonial.author[0]}
                                            </div>
                                            <div className="ml-4 text-left">
                                                <p className="text-base font-bold text-gray-900">{testimonial.author}</p>
                                                <p className="mt-0.5 text-sm text-gray-600">{testimonial.role}</p>
                                            </div>
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
