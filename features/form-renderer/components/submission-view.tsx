"use client";

import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/data/constants";
import HandleInput from "@/features/organization/components/handle-input";

/**
 * A highly minimal Next.js page component to display after a successful
 * form submission with a subtle prompt to explore the platform.
 */
export default function SubmissionView() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg border-t-4 border-t-primary">
        <CardHeader className="space-y-4 pt-8">
          <div className="flex justify-center">
            {/* Success Icon */}
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-in fade-in zoom-in" />
          </div>
          <CardTitle className="text-2xl">Message Sent</CardTitle>
          <CardDescription className="text-base text-gray-700 dark:text-gray-300">
            Your message has been successfully delivered.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">

          {/* Subtle Platform Promotion */}
          <div className="mt-4 pt-4 border-t flex flex-col items-center gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Want to <span className="font-bold">create your own</span> {APP_NAME}?
            </p>
            <HandleInput />
            <Button className="w-full">Claim</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
