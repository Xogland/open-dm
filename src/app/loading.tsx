"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-[9999]">
            <div className="relative flex flex-col items-center gap-8">
                {/* Animated Logo/Icon Placeholder */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: [0.8, 1.1, 1],
                        opacity: 1,
                        rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 backdrop-blur-sm"
                >
                    <div className="w-8 h-8 rounded-lg bg-primary animate-pulse" />
                </motion.div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-2">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-sm font-medium tracking-widest uppercase text-muted-foreground"
                    >
                        Initializing OpenDM
                    </motion.p>

                    {/* Progress bar line */}
                    <div className="w-48 h-[2px] bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
