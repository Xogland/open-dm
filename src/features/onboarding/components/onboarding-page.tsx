"use client";

import { useOnboarding } from "../hooks/use-onboarding";
import { OnboardingForm } from "./onboarding-form";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
    const {
        step,
        name,
        setName,
        handle,
        setHandle, // Still exposed for input binding? Actually useOnboarding exposes it.
        handleStatus,
        onHandleStatusChange,
        category,
        setCategory,
        businessType,
        setBusinessType,
        loading,
        redemptionKey,
        nextStep,
        prevStep,
        handleSubmit,
    } = useOnboarding();

    const { organizations } = useUserData();
    const router = useRouter();

    useEffect(() => {
        // If the user already has organizations, they shouldn't be on the onboarding page
        // unless they are explicitly creating a new one (future feature).
        // For now, redirect to dashboard to prevent "stuck in onboarding" loop.
        if (organizations && organizations.length > 0) {
            router.replace("/dashboard");
        }
    }, [organizations, router]);

    return (
        <OnboardingForm
            step={step}
            name={name}
            setName={setName}
            handle={handle}
            onHandleStatusChange={onHandleStatusChange}
            handleStatus={handleStatus}
            category={category}
            setCategory={setCategory}
            businessType={businessType}
            setBusinessType={setBusinessType}
            loading={loading}
            redemptionKey={redemptionKey}
            nextStep={nextStep}
            prevStep={prevStep}
            onSubmit={handleSubmit}
        />
    );
}
