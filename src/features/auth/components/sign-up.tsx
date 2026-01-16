"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { APP_NAME } from "@/data/constants";
import { Typography } from "@/components/ui/typography";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Check,
    Loader2,
    Info,
    X,
    Lock,
    ShieldAlert,
    Key
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHandleValidation } from "@/features/organization/hooks/use-handle-validation";

export function SignUp() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const { signIn } = useAuthActions();

    // Use shared validation hook
    const {
        handle,
        setHandle, // This matches the specific signature required for onChange
        status: statusState,
        checkHandleResult,
        redemptionKey,
    } = useHandleValidation(searchParams.get("handle") || "");

    // 🔹 Google OAuth
    const handleGoogleSignIn = async () => {
        // Allow signup if available or if it's a valid key unlock
        const isAllowed = statusState === "available";

        if (!isAllowed) return;
        setLoading(true);

        // Persist valid handle for Onboarding flow
        if (handle) {
            localStorage.setItem("onboarding_handle", handle);
        }

        try {
            await signIn("google", {
                flow: "sign-up",
                data: "This is a test message from the client.",
                redirectTo: "/dashboard", // Redirect to dashboard checks
            });
        } catch (error: any) {
            if (error) {
                console.error("Error signing in with Google:", error.message);
                setLoading(false);
            }
        }
    };


    return (
        <div className="w-full space-y-5">
            {/* Handle Input Section */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label htmlFor="handle" className="text-xs font-medium ml-1 text-slate-600">
                        Claim your unique handle
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="inline ml-1.5 h-3 w-3 text-slate-400 hover:text-slate-600 cursor-help transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-white border-slate-200 text-slate-700 shadow-xl">
                                    <p>Unique identifier for your organization URL</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Label>
                    <span className={cn(
                        "text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-bold transition-colors duration-300",
                        statusState === 'available' && "bg-green-100/80 text-green-700",
                        statusState === 'taken' && "bg-rose-100/80 text-rose-700",
                        (statusState === 'reserved' || statusState === 'official') && "bg-amber-100/80 text-amber-700",
                        statusState === 'checking' && "text-slate-500",
                        statusState === 'idle' && "opacity-0"
                    )}>
                        {statusState}
                    </span>
                </div>

                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono select-none pointer-events-none group-focus-within:text-slate-600 transition-colors">
                        open-dm.io/
                    </div>
                    <Input
                        id="handle"
                        placeholder="acme"
                        value={handle}
                        onChange={setHandle}
                        className={cn(
                            "h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all pl-[108px] pr-10 font-mono text-sm shadow-inner text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50",
                            statusState === 'available' && "border-green-200 bg-green-50/30 focus:border-green-500/50 focus:ring-green-500/20",
                            statusState === 'taken' && "border-rose-200 bg-rose-50/30 focus:border-rose-500/50 focus:ring-rose-500/20",
                            (statusState === 'reserved' || statusState === 'official') && "border-amber-200 bg-amber-50/30 focus:border-amber-500/50 focus:ring-amber-500/20",
                        )}
                    />

                    {/* Status Icon */}
                    <div className="absolute right-3 top-3 transition-all duration-300">
                        {(statusState === 'checking' || statusState === 'typing') && (
                            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                        )}
                        {statusState === 'available' && (
                            <Check className="h-5 w-5 text-green-500 animate-in zoom-in duration-300" />
                        )}
                        {statusState === 'taken' && (
                            <X className="h-5 w-5 text-rose-500 animate-in zoom-in duration-300" />
                        )}
                        {(statusState === 'reserved' || statusState === 'official') && (
                            <Lock className="h-5 w-5 text-amber-500 animate-in zoom-in duration-300" />
                        )}
                    </div>
                </div>

                {/* Status Message */}
                <div className="h-5 overflow-hidden pl-1">
                    {statusState === 'available' && (
                        <p className="text-xs text-green-600 flex items-center animate-in slide-in-from-top-1 font-medium">
                            <Check className="w-3 h-3 mr-1" />
                            {redemptionKey ? "Key valid! Handle unlocked." : "Available for registration"}
                        </p>
                    )}
                    {statusState === 'taken' && (
                        <p className="text-xs text-rose-600 flex items-center animate-in slide-in-from-top-1 font-medium">
                            <ShieldAlert className="w-3 h-3 mr-1" /> This handle is already taken
                        </p>
                    )}
                    {statusState === 'official' && (
                        <p className="text-xs text-slate-500 flex items-center animate-in slide-in-from-top-1">
                            {redemptionKey ? (
                                <>
                                    <ShieldAlert className="w-3 h-3 mr-1" />
                                    Invalid key for this official handle.
                                </>
                            ) : (
                                <>
                                    <ShieldAlert className="w-3 h-3 mr-1" /> {checkHandleResult?.message}
                                </>
                            )}
                        </p>
                    )}
                    {statusState === 'reserved' && (
                        <p className="text-xs text-amber-600 flex items-center animate-in slide-in-from-top-1 font-medium">
                            {redemptionKey ? (
                                <>
                                    <ShieldAlert className="w-3 h-3 mr-1" />
                                    Invalid key for this handle.
                                </>
                            ) : (
                                <>
                                    <Lock className="w-3 h-3 mr-1" />
                                    Reserved Handle. Please contact support.
                                </>
                            )}
                        </p>
                    )}
                </div>

                {/* Key Indicator */}
                {redemptionKey && (
                    <div className="animate-in fade-in slide-in-from-top-1 px-1">
                        <Badge variant="outline" className={cn(
                            "text-[10px] font-mono border-opacity-60 backdrop-blur-sm",
                            statusState === 'available'
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-indigo-200 bg-indigo-50 text-indigo-700"
                        )}>
                            <Key className="w-3 h-3 mr-1" />
                            Key: {redemptionKey.substring(0, 4)}...
                        </Badge>
                    </div>
                )}
            </div>

            {/* Google Signup */}
            <motion.div whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.01 }}>
                <Button
                    type="button"
                    variant="outline"
                    disabled={loading || statusState !== "available"}
                    className="w-full h-11 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-sm transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGoogleSignIn}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    ) : (
                        <FcGoogle className="w-5 h-5" />
                    )}
                    {loading ? "Creating account..." : "Continue with Google"}
                </Button>
            </motion.div>

            <p className="text-xs text-center text-slate-500 mt-6">
                Already have an account?{" "}
                <Link
                    replace
                    href={`/sign-in?redirect=${searchParams.get("redirect") || "/"}`}
                    className="font-medium text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
