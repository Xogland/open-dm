import React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Check,
    Loader2,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Progress from "@/components/ui/progress";
import { Typography } from "@/components/ui/typography";
import { BasicDetailsStep } from "@/features/organization/components/steps/basic-details-step";
import { CategoryStep } from "@/features/organization/components/steps/category-step";
import { BusinessTypeStep } from "@/features/organization/components/steps/business-type-step";
import { HandleState, CheckHandleResultType } from "@/features/organization/components/handle-input";

export interface OnboardingFormProps {
    step: number;
    name: string;
    setName: (name: string) => void;
    handle: string;
    onHandleStatusChange: (status: HandleState, h: string, result?: CheckHandleResultType, key?: string) => void;
    // We don't need manual handle status props because BasicDetailsStep manages the UI, 
    // and useOnboarding manages the validation state for nextStep via onHandleStatusChange.

    // However, does OnboardingForm need to know status for Next button disable?
    // Yes, 'isNextDisabled' check.
    // Parent should probably pass 'isNextDisabled' or 'handleStatus' so we can check locally?
    // Let's pass 'handleStatus'
    handleStatus: HandleState;

    category: string;
    setCategory: (category: string) => void;
    businessType: string;
    setBusinessType: (type: string) => void;
    redemptionKey?: string;
    loading: boolean;
    nextStep: () => void;
    prevStep: () => void;
    onSubmit: () => void;
}

export function OnboardingForm({
    step,
    name,
    setName,
    handle,
    onHandleStatusChange,
    handleStatus,
    category,
    setCategory,
    businessType,
    setBusinessType,
    redemptionKey,
    loading,
    nextStep,
    prevStep,
    onSubmit,
}: OnboardingFormProps) {
    const progress = (step / 3) * 100;

    const isNextDisabled = () => {
        if (step === 1) {
            // Strictly require 'available' status to proceed
            if (!name || !handle || handleStatus !== HandleState.available) return true;
            return false;
        }
        if (step === 2 && !category) return true;
        if (step === 3 && !businessType) return true;
        return false;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent p-4 font-sans">
            <div className="w-full max-w-xl space-y-8 animate-in fade-in zoom-in-95 duration-700">

                {/* Header Section */}
                <div className="space-y-6 text-center">
                    <div className="space-y-2">
                        <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary text-[10px]">
                            Step {step} of 3
                        </Badge>
                        <Typography variant="h1" className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Setup Organization
                        </Typography>
                        <Typography variant="muted" as="p" className="max-w-sm mx-auto">
                            Configure your workspace settings and profile details.
                        </Typography>
                    </div>

                    <div className="relative pt-2">
                        <Progress value={progress} className="h-1.5 w-full max-w-xs mx-auto rounded-full bg-secondary/50" />
                        <div className="flex justify-between max-w-xs mx-auto mt-2 text-[10px] text-muted-foreground">
                            <span className={cn(step >= 1 && "text-primary")}>Basics</span>
                            <span className={cn(step >= 2 && "text-primary")}>Category</span>
                            <span className={cn(step >= 3 && "text-primary")}>Type</span>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="border-border/40 bg-card/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-50" />

                    <CardContent className="p-8 space-y-8 min-h-[300px]">
                        {step === 1 && (
                            <BasicDetailsStep
                                name={name}
                                setName={setName}
                                handle={handle}
                                onHandleStatusChange={onHandleStatusChange}
                                redemptionKey={redemptionKey}
                            />
                        )}

                        {step === 2 && (
                            <CategoryStep
                                category={category}
                                setCategory={setCategory}
                            />
                        )}

                        {step === 3 && (
                            <BusinessTypeStep
                                businessType={businessType}
                                setBusinessType={setBusinessType}
                            />
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-between border-t border-border/40 p-8 pt-6 bg-secondary/10">
                        {step > 1 ? (
                            <Button variant="ghost" onClick={prevStep} disabled={loading} className="px-6 hover:bg-background/80">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        ) : <div />}

                        {step < 3 ? (
                            <Button
                                onClick={nextStep}
                                disabled={isNextDisabled()}
                                className="px-8 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next Step
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={onSubmit}
                                disabled={loading || !businessType}
                                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 px-10 h-11 text-base transition-all hover:scale-[1.02] active:scale-95"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="mr-2 h-4 w-4" />
                                )}
                                Complete Setup
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
