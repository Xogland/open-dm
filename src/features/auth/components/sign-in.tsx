"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { APP_NAME } from "@/data/constants";
import { useSearchParams } from "next/navigation";
import { Typography } from "@/components/ui/typography";

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
        <div className="w-full space-y-4">

            {/* Google SignIn */}
            <motion.div whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.01 }}>
                <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="w-full h-11 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-sm transition-all text-sm font-medium flex items-center justify-center gap-2"
                    onClick={handleGoogleSignIn}
                >
                    <FcGoogle className="w-5 h-5" />
                    {loading ? "Signing in..." : "Continue with Google"}
                </Button>
            </motion.div>

            <p className="text-xs text-center text-slate-500 mt-4">
                {`New to ${APP_NAME}? `}
                <Link
                    replace={true}
                    href={`/sign-up?redirect=${searchParams.get("redirect") || "/"}`}
                    className="font-medium text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline"
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}

