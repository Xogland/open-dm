"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8"
            >
                <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto border border-destructive/20">
                    <AlertCircle className="w-10 h-10 text-destructive" />
                </div>

                <div className="space-y-4">
                    <Typography variant="heading" className="text-3xl font-bold">
                        Something went wrong
                    </Typography>
                    <Typography variant="subheading" className="text-muted-foreground">
                        We encountered an unexpected error. Our team has been notified and
                        is looking into it.
                    </Typography>
                    {error.digest && (
                        <code className="block p-3 bg-muted rounded-lg text-xs font-mono text-muted-foreground overflow-auto">
                            Digest: {error.digest}
                        </code>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={reset}
                        variant="default"
                        size="lg"
                        className="h-12 px-8 rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all flex-1 sm:flex-none"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try again
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 rounded-full flex-1 sm:flex-none"
                    >
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </div>
            </motion.div>

            <div className="mt-12 opacity-50">
                <Typography variant="caption" className="font-mono uppercase tracking-widest">
                    Error Protocol Sync: Fail
                </Typography>
            </div>
        </div>
    );
}
