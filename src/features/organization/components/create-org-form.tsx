"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { BasicDetailsStep } from "./steps/basic-details-step";
import { CategoryStep } from "./steps/category-step";
import { BusinessTypeStep } from "./steps/business-type-step";
import { HandleState, CheckHandleResultType } from "@/features/organization/components/handle-input";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Progress from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface CreateOrgFormProps {
    organisationName: string;
    setOrganisationName: (name: string) => void;
    handle: string;
    setHandle: (handle: string) => void;
    setHandleStatus: (status: HandleState) => void;
    redemptionKey?: string;
    setRedemptionKey?: (key: string | undefined) => void;

    category: string;
    setCategory: (category: string) => void;
    businessType: string;
    setBusinessType: (type: string) => void;

    loading: boolean;
    upgradeDialogOpen: boolean;
    setUpgradeDialogOpen: (open: boolean) => void;
    isFormValid: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function CreateOrgForm({
    organisationName,
    setOrganisationName,
    handle,
    setHandle,
    setHandleStatus,
    redemptionKey,
    setRedemptionKey,
    category,
    setCategory,
    businessType,
    setBusinessType,
    loading,
    upgradeDialogOpen,
    setUpgradeDialogOpen,
    isFormValid,
    onSubmit,
}: CreateOrgFormProps) {
    const [step, setStep] = useState(1);
    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleHandleStatusChange = (status: HandleState, h: string, result?: CheckHandleResultType, key?: string) => {
        setHandleStatus(status);
        setHandle(h);
        if (setRedemptionKey) {
            setRedemptionKey(key);
        }
    };

    const isNextDisabled = () => {
        if (step === 1) {
            return !organisationName || !handle;
        }
        if (step === 2) return !category;
        if (step === 3) return !businessType;
        return false;
    };

    return (
        <div className="flex items-center justify-center p-4 sm:p-8 h-full">
            <Card className="w-full max-w-2xl shadow-xl border-border/40 bg-card/60 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-50" />

                <CardHeader className="text-center space-y-4 pb-2">
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Create Organization
                        </CardTitle>
                        <CardDescription>
                            Step {step} of {totalSteps}
                        </CardDescription>
                    </div>
                    <Progress value={progress} className="h-1 w-full max-w-xs mx-auto rounded-full bg-secondary/50" />
                </CardHeader>

                <CardContent className="p-6 md:p-8 min-h-[300px]">
                    <div className="relative">
                        {step === 1 && (
                            <BasicDetailsStep
                                name={organisationName}
                                setName={setOrganisationName}
                                handle={handle}
                                onHandleStatusChange={handleHandleStatusChange}
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
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-border/40 p-6 bg-secondary/10">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1 || loading}
                        className={cn("px-6", step === 1 && "invisible")}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>

                    {step < totalSteps ? (
                        <Button
                            onClick={nextStep}
                            disabled={isNextDisabled()}
                            className="bg-foreground text-background hover:bg-foreground/90"
                        >
                            Next Step <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={onSubmit}
                            disabled={!isFormValid || loading}
                            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 min-w-[140px]"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="mr-2 h-4 w-4" />
                            )}
                            Create Organization
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <UpgradeDialog
                open={upgradeDialogOpen}
                onOpenChange={setUpgradeDialogOpen}
                title="Organization Limit Reached"
                description="You've reached the limit of organizations for your current plan. Upgrade to create more."
            />
        </div>
    );
}
