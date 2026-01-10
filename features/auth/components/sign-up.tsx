"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";
import HandleInput, { HandleState } from "@/features/organization/components/handle-input";
import { useAuthActions } from "@convex-dev/auth/react";
import { APP_NAME } from "@/data/constants";
import { Typography } from "@/components/ui/typography";

export function SignUp() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const [handle, setHandle] = useState(searchParams.get("handle") || "");
    const [status, setStatus] = useState<HandleState>(HandleState.idle);
    const { signIn } = useAuthActions();

    // 🔹 Google OAuth
    const handleGoogleSignIn = async () => {
        if (status !== "available") return;
        setLoading(true);
        try {
            await signIn("google", {
                flow: "sign-up",
                data: "This is a test message from the client.",
                redirectTo: "/dashboard",
            });
        } catch (error: any) {
            if (error) {
                console.error("Error signing in with Google:", error.message);
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-secondary to-background">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md p-8"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    <Typography variant="heading" className="text-4xl drop-shadow-md">
                        {`Sign up to ${APP_NAME}`}
                    </Typography>
                    <Typography variant="body" className="text-gray-500 text-sm">
                        Get a Link in bio, Website, Online Store, Email Marketing, Media Kit
                        and more for free.
                    </Typography>
                </div>

                {/* Handle Input */}
                <form className="mt-8 space-y-5">
                    <HandleInput
                        initialHandle={handle}
                        onStatusChange={(newStatus, newHandle) => {
                            setStatus(newStatus);
                            setHandle(newHandle);
                        }}
                    />
                </form>

                {/* Google Signup */}
                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={loading || status !== "available"}
                        className="w-full mt-6 shadow-md transition flex items-center justify-center py-3 disabled:opacity-50"
                        onClick={handleGoogleSignIn}
                    >
                        {loading ? (
                            <span className="animate-spin mr-2">⏳</span>
                        ) : (
                            <FcGoogle className="w-6 h-6 mr-2" />
                        )}
                        {loading ? "Signing in..." : "Sign up with Google"}
                    </Button>
                </motion.div>

                <Typography variant="caption" className="text-center text-xs text-gray-500 mt-4 block">
                    Already have an account?{" "}
                    <Link
                        replace
                        href={`/sign-in?redirect=${searchParams.get("redirect") || "/"}`}
                        className="underline hover:text-gray-700"
                    >
                        Sign in
                    </Link>
                </Typography>
            </motion.div>
        </div>
    );
}
