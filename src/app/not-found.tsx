"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
            {/* Background Decorative Element */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 text-center space-y-8 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="muted" className="text-xl font-mono mb-2">404</Typography>
                    <Typography variant="heading" className="text-5xl md:text-7xl font-bold tracking-tight">
                        Page Not Found
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Typography variant="subheading" className="text-muted-foreground mx-auto max-w-md">
                        The page you're looking for doesn't exist or has been moved.
                        Perhaps you've wandered into a private DM that isn't yours?
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-12 px-6 rounded-full group"
                    >
                        <button onClick={() => window.history.back()} className="flex items-center">
                            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </button>
                    </Button>
                    <Button
                        asChild
                        variant="default"
                        size="lg"
                        className="h-12 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    >
                        <Link href="/">
                            <Home className="mr-2 w-4 h-4" />
                            Return Home
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Subtle bottom detail */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground"
            >
                OpenDM // Protocol Error 0x404
            </motion.div>
        </div>
    );
}
