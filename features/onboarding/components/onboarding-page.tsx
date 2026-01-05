"use client";

import { useOnboarding } from "../hooks/use-onboarding";
import { OnboardingForm, CheckHandleResult } from "./onboarding-form";

export default function OnboardingPage() {
    const {
        step,
        name,
        setName,
        handle,
        setHandle,
        debouncedHandle,
        category,
        setCategory,
        businessType,
        setBusinessType,
        loading,
        checkHandleResult,
        redemptionKey,
        nextStep,
        prevStep,
        handleSubmit,
    } = useOnboarding();

    return (
        <OnboardingForm
            step={step}
            name={name}
            setName={setName}
            handle={handle}
            setHandle={setHandle}
            debouncedHandle={debouncedHandle}
            category={category}
            setCategory={setCategory}
            businessType={businessType}
            setBusinessType={setBusinessType}
            loading={loading}
            checkHandleResult={checkHandleResult as CheckHandleResult | undefined}
            redemptionKey={redemptionKey}
            nextStep={nextStep}
            prevStep={prevStep}
            onSubmit={handleSubmit}
        />
    );
}
