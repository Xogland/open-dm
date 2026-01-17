"use client";

import React, { useState, useMemo } from "react";
import { FormContentData } from "@/features/form-editor/components/content-section";
import { WorkflowData, WorkflowStep, ExternalBrowserStep } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, GlobeIcon, PhoneIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Typography } from "@/components/ui/typography";

interface UnifiedFormData {
    content: FormContentData;
    workflows: WorkflowData;
}

interface PublicWorkflowRendererProps {
    data: UnifiedFormData;
    onSubmit: (formData: Record<string, unknown>) => Promise<void>;
    isSubmitting: boolean;
    organization?: { name: string; image?: string };
}

export default function PublicWorkflowRenderer({
    data,
    onSubmit,
    isSubmitting,
    organization,
}: PublicWorkflowRendererProps) {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, unknown>>({});
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const { content, workflows } = data;

    // Derive current workflow steps based on selection
    const currentWorkflowSteps = useMemo(() => {
        if (!selectedService) return [];
        return workflows[selectedService] || [];
    }, [selectedService, workflows]);

    const currentStep = currentWorkflowSteps[currentStepIndex];
    const isLastStep = currentStepIndex === currentWorkflowSteps.length - 1;

    const handleStartService = (serviceTitle: string) => {
        setSelectedService(serviceTitle);
        setCurrentStepIndex(0);
        setAnswers({}); // Reset answers or keep common ones? Reset for now.
    };

    const handleAnswerChange = (value: unknown) => {
        if (!currentStep) return;
        setAnswers((prev) => ({
            ...prev,
            [currentStep.id]: value,
        }));
    };

    const handleNext = async () => {
        // Logic for moving next
        // If end_screen, external_browser or last step, trigger submit
        if (currentStep.stepType === 'end_screen' || currentStep.stepType === 'external_browser') {
            return; // It's just a view
        }

        if (isLastStep) {
            await handleSubmit();
        } else {
            const nextStep = currentWorkflowSteps[currentStepIndex + 1];
            if (nextStep && (nextStep.stepType === 'end_screen' || nextStep.stepType === 'external_browser')) {
                // If next is a terminal screen, submit first
                await handleSubmit();
            } else {
                setCurrentStepIndex((prev) => prev + 1);
            }
        }
    };

    const handleSubmit = async () => {
        // Prepare final data
        const finalData = {
            service: selectedService,
            ...answers
        };
        await onSubmit(finalData as Record<string, unknown>);

        // Move to terminal screen (end screen or external browser)
        const terminalIndex = currentWorkflowSteps.findIndex(s =>
            s.stepType === 'end_screen' || s.stepType === 'external_browser'
        );

        if (terminalIndex !== -1) {
            setCurrentStepIndex(terminalIndex);
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        } else {
            setSelectedService(null);
        }
    };

    // --- RENDERERS ---

    const renderProfileCard = () => (
        <Card className="h-full border-none shadow-none bg-transparent">
            <CardHeader className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                    <AvatarImage src={organization?.image} />
                    <AvatarFallback className="text-2xl">{organization?.name?.substring(0, 2).toUpperCase() || "OR"}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <CardTitle><Typography variant="subheading">{organization?.name || "Organization"}</Typography></CardTitle>
                    <CardDescription>
                        <Typography variant="body" className="text-base max-w-xs mx-auto">
                            {content.description || "Welcome to our inquiry form."}
                        </Typography>
                    </CardDescription>
                </div>

                {/* Contact Chips */}
                <div className="flex flex-wrap gap-2 justify-center mt-4">

                    {content.contactType === 'phone' && content.phone && (
                        <Button variant="outline" size="sm" className="rounded-full text-xs h-7" asChild>
                            <Link href={`tel:${content.phone}`}>
                                <PhoneIcon className="h-3 w-3 mr-1.5" /> Call
                            </Link>
                        </Button>
                    )}
                    {content.website && (
                        <Button variant="outline" size="sm" className="rounded-full text-xs h-7" asChild>
                            <Link href={content.website} target="_blank">
                                <GlobeIcon className="h-3 w-3 mr-1.5" /> Website
                            </Link>
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex justify-center pb-2">

            </CardContent>
        </Card>
    );

    const renderServiceSelection = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 mb-8">
                <Typography variant="subheading" as="h2">How can we help you?</Typography>
                <Typography variant="caption" className="text-base">Select a topic to get started.</Typography>
            </div>

            <div className="grid gap-3">
                {content.services.map((service) => (
                    <Button
                        key={service.id}
                        variant="outline"
                        className="h-auto py-4 px-6 justify-between text-base hover:border-primary hover:bg-primary/5 transition-all group"
                        onClick={() => handleStartService(service.title)}
                    >
                        {service.title}
                        <ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Button>
                ))}
            </div>
        </div>
    );

    const renderStepInput = (step: WorkflowStep) => {
        const value = (answers[step.id] as string) || "";

        switch (step.stepType) {
            case "text":
                return (
                    <div className="space-y-4">
                        <Label className="text-lg">{step.question}</Label>
                        <Input
                            placeholder={step.placeholder}
                            value={value}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className="py-6 text-lg"
                            autoFocus
                        />
                    </div>
                );
            case "number":
                return (
                    <div className="space-y-4">
                        <Label className="text-lg">{step.question}</Label>
                        <Input
                            type="tel"
                            placeholder={step.placeholder}
                            value={value}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            className="py-6 text-lg"
                            autoFocus
                        />
                    </div>
                );
            case "multiple_choice":
                return (
                    <div className="space-y-4">
                        <Label className="text-lg">{step.question}</Label>
                        <div className="grid gap-2 pt-2">
                            {step.options?.map((option) => (
                                <Button
                                    key={typeof option === 'string' ? option : option.title}
                                    variant={value === (typeof option === 'string' ? option : option.title) ? "default" : "outline"}
                                    className={cn("justify-start h-auto py-3 px-4 text-left font-normal", value === (typeof option === 'string' ? option : option.title) && "font-medium")}
                                    onClick={() => handleAnswerChange(typeof option === 'string' ? option : option.title)}
                                >
                                    {value === (typeof option === 'string' ? option : option.title) && <CheckCircle2Icon className="h-4 w-4 mr-2" />}
                                    {typeof option === 'string' ? option : option.title}
                                </Button>
                            ))}
                        </div>
                    </div>
                );
            case "date":
                return (
                    <div className="space-y-4 flex flex-col">
                        <Label className="text-lg">{step.question}</Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal py-6 text-lg",
                                        !value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {value ? format(new Date(value as string), "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={value ? new Date(value as string) : undefined}
                                    onSelect={(date) => {
                                        handleAnswerChange(date?.toISOString());
                                        if (date) setIsCalendarOpen(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                );
            case "end_screen":
                return (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 animate-in zoom-in-50 duration-500">
                        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2Icon className="h-8 w-8" />
                        </div>
                        <Typography variant="subheading" as="h2">{step.question || "Thank you!"}</Typography>
                        <Typography variant="caption" className="text-base">Your request has been received.</Typography>
                        <Button className="mt-6" variant="outline" onClick={() => window.location.reload()}>
                            Submit Another Response
                        </Button>
                    </div>
                );
            case "external_browser":
                return (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 animate-in zoom-in-50 duration-500">
                        <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
                            <CheckCircle2Icon className="h-8 w-8" />
                        </div>
                        <Typography variant="subheading" as="h2">Thank you!</Typography>
                        <Typography variant="caption" className="text-base">Click the button below to continue.</Typography>
                        <Button className="mt-6" onClick={() => { if (typeof window !== 'undefined') window.location.href = (step as ExternalBrowserStep).url; }}>
                            {(step as ExternalBrowserStep).buttonText || "Continue"}
                        </Button>
                    </div>
                );
            default:
                return <p>Unknown step type</p>;
        }
    };

    return (
        <div className="w-full min-h-screen bg-background flex flex-col md:flex-row">
            {/* Left Panel - Profile & Info */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-muted/30 border-r border-border p-6 flex flex-col justify-center">
                {renderProfileCard()}
            </div>

            {/* Right Panel - Workflow */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-y-auto">
                    <div className="w-full max-w-lg min-h-[400px] flex flex-col">
                        {!selectedService ? (
                            renderServiceSelection()
                        ) : (
                            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-300">
                                {/* Step Indicator */}
                                {currentStep?.stepType !== 'end_screen' && currentStep?.stepType !== 'external_browser' && (
                                    <div className="mb-8 flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Step {currentStepIndex + 1} of {currentWorkflowSteps.length > 0 ? (currentWorkflowSteps.filter(s => s.stepType !== 'end_screen').length) : 1}</span>
                                        <span className="text-primary">{Math.round(((currentStepIndex + 1) / (currentWorkflowSteps.length)) * 100)}%</span>
                                    </div>
                                )}

                                <div className="flex-1 flex flex-col justify-center">
                                    {currentStep && renderStepInput(currentStep)}
                                </div>

                                {/* Navigation */}
                                {currentStep?.stepType !== 'end_screen' && currentStep?.stepType !== 'external_browser' && (
                                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/50">
                                        <Button variant="ghost" onClick={handleBack} disabled={isSubmitting}>
                                            <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back
                                        </Button>

                                        <Button onClick={handleNext} disabled={isSubmitting || (currentStep && ['text', 'number', 'date'].includes(currentStep.stepType) && !answers[currentStep.id])}>
                                            {isSubmitting ? (
                                                "Submitting..."
                                            ) : (
                                                <>
                                                    {(currentWorkflowSteps[currentStepIndex + 1]?.stepType === 'end_screen' || currentWorkflowSteps[currentStepIndex + 1]?.stepType === 'external_browser') ? "Submit" : "Continue"} <ArrowRightIcon className="h-4 w-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
