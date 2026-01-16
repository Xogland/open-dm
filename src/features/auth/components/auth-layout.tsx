"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { APP_NAME } from "@/data/constants";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
  mode: "sign-in" | "sign-up";
}

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] relative flex items-center justify-center overflow-hidden selection:bg-indigo-500/20">

      {/* === ANIMATED BACKGROUND (Light Mode) === */}
      <div className="absolute inset-0 w-full h-full">
        {/* Grid Pattern - darker opacity for visibility on white */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] bg-[length:30px_30px]" />

        {/* Animated Orbs - softer colors for light theme */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/5 rounded-full blur-[100px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-500/5 rounded-full blur-[100px] animate-pulse delay-1000 duration-[10000ms]" />
      </div>

      {/* CONTAINER */}
      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center gap-6">

        {/* Floating Brand Element */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-row items-center text-center"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl">
            <Image src={'/opendm.png'} alt="OpenDM Logo" width={30} height={30} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {APP_NAME}
          </h1>
        </motion.div>

        {/* MAIN CARD */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full relative"
        >
          {/* The Card */}
          <div className="relative w-full bg-white px-8 py-10 rounded-2xl shadow-xl border border-slate-100/60 ring-1 ring-slate-100/50">

            {/* Dynamic Header Text */}
            <div className="mb-8 text-center space-y-1.5">
              <h2 className="text-xl font-semibold text-slate-900">
                {mode === 'sign-in' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-sm text-slate-500">
                {mode === 'sign-in' ? 'Enter your details to access your account.' : 'Join for free to start building today.'}
              </p>
            </div>

            {children}

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-slate-300" /> Secure</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-slate-300" /> Fast</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-6 text-sm text-slate-400"
        >
          <a href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</a>
          <span className="w-px h-4 bg-slate-200" />
          <a href="/terms" className="hover:text-slate-600 transition-colors">Terms</a>
        </motion.div>

      </div>

    </div>
  );
}
