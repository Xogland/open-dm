"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { APP_NAME } from "@/data/constants";
import { useSearchParams } from "next/navigation";

export function SignIn() {
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuthActions();
    const searchParams = useSearchParams();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signIn("google", {
                flow: "sign-in",
                data: "This is a test message from the client.",
                redirectTo: "/dashboard",
            });
        } catch (error: any) {
            setLoading(false);
            if (error) {
                console.error("Error signing in with Google:", error.message);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-linear-to-br from-secondary to-background">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md p-8"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    <h2 className="font-extrabold drop-shadow-md">{APP_NAME}</h2>
                    <h1 className="text-4xl font-extrabold drop-shadow-md">
                        Welcome back!
                    </h1>
                    <p className="text-center text-xs text-gray-500 mt-4">
                        {`New to ${APP_NAME}? `}
                        <Link
                            replace={true}
                            href={`/sign-up?redirect=${searchParams.get("redirect") || "/"}`}
                            className="underline hover:text-gray-700"
                        >
                            Sign up.
                        </Link>
                    </p>
                </div>
                {/* Google Signup */}
                <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={loading}
                        className="w-full mt-6 font-medium shadow-md transition flex items-center justify-center py-3"
                        onClick={handleGoogleSignIn}
                    >
                        <FcGoogle className="w-6 h-6 mr-2" />
                        {loading ? "Signing in..." : "Sign in with Google"}
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
