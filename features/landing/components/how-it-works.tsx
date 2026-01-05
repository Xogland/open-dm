"use client";

import { motion } from "framer-motion";
import { HOW_IT_WORKS } from "../constants/landing-content";

export function HowItWorksNew() {
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
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                        How it works
                    </h2>
                    <p className="text-lg text-muted-foreground">Three simple steps to professional inbound.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {HOW_IT_WORKS.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 rounded-3xl bg-background border border-border shadow-sm flex flex-col h-full"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6`}>
                                <span className={`text-2xl font-bold text-primary`}>
                                    {step.number.replace(/^0/, '')}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-4">
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
