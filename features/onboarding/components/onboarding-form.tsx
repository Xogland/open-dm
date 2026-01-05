"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Check,
    Loader2,
    ChevronRight,
    ChevronLeft,
    Building2,
    Store,
    Users,
    Briefcase,
    X,
    Lock,
    ShieldAlert,
    Info,
    Key
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Progress from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";

export interface CheckHandleResult {
    status: "available" | "taken" | "reserved";
    type?: "official" | "default";
    message?: string;
}

export interface OnboardingFormProps {
    step: number;
    name: string;
    setName: (name: string) => void;
    handle: string;
    setHandle: (e: React.ChangeEvent<HTMLInputElement>) => void;
    debouncedHandle: string;
    category: string;
    setCategory: (category: string) => void;
    businessType: string;
    setBusinessType: (type: string) => void;
    redemptionKey: string;
    loading: boolean;
    checkHandleResult: CheckHandleResult | undefined;
    nextStep: () => void;
    prevStep: () => void;
    onSubmit: () => void;
}

const CATEGORIES = [
    "Education", "Automotive", "Shopping & Retail", "Arts & Entertainment",
    "Beauty Cosmetics & Personal Care", "Finance", "Apparel & Clothing", "Health",
    "Restaurant", "Travel", "Hotel", "Nonprofit Organisation", "Event Planning",
    "Tech & Software", "Real Estate", "Marketing", "Consulting", "Fitness"
];

const BUSINESS_TYPES = [
    { label: "Creators", icon: Users },
    { label: "Freelancers", icon: Briefcase },
    { label: "Consultants", icon: Building2 },
    { label: "Professional Services", icon: Briefcase },
    { label: "Agencies", icon: Building2 },
    { label: "SMEs", icon: Store }
];

export function OnboardingForm({
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
    redemptionKey,
    loading,
    checkHandleResult,
    nextStep,
    prevStep,
    onSubmit,
}: OnboardingFormProps) {
    const progress = (step / 3) * 100;

    // Determine Handle Input Status
    // States: 'idle', 'typing', 'checking', 'success', 'error', 'reserved'
    // console.log("Form Status Debug:", { handle, debouncedHandle, match: handle === debouncedHandle });
    const isTyping = handle !== debouncedHandle;
    const isThinking = !isTyping && debouncedHandle && checkHandleResult === undefined;

    let statusState: 'idle' | 'typing' | 'checking' | 'available' | 'taken' | 'reserved' | 'official' = 'idle';

    if (!handle) statusState = 'idle';
    else if (isTyping) statusState = 'typing';
    else if (isThinking) statusState = 'checking';
    else if (checkHandleResult?.status === 'available') statusState = 'available';
    else if (checkHandleResult?.status === 'taken') statusState = 'taken';
    else if (checkHandleResult?.status === 'reserved') {
        statusState = checkHandleResult.type === 'official' ? 'official' : 'reserved';
    }

    const isNextDisabled = () => {
        if (step === 1) {
            // Strictly require 'available' status to proceed
            if (!name || !handle || statusState !== 'available') return true;
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
                        <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/5 text-primary tracking-widest text-[10px] uppercase font-bold">
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
                        <div className="flex justify-between max-w-xs mx-auto mt-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            <span className={cn(step >= 1 && "text-primary")}>Basics</span>
                            <span className={cn(step >= 2 && "text-primary")}>Category</span>
                            <span className={cn(step >= 3 && "text-primary")}>Type</span>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="border-border/40 bg-card/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-50" />

                    <CardContent className="p-8 space-y-8">
                        {step === 1 && (
                            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                                {/* Name Input */}
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-sm font-medium ml-1">Organization Name</Label>
                                    <div className="relative group">
                                        <Input
                                            id="name"
                                            placeholder="e.g. Acme Industries"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 bg-secondary/30 border-secondary focus:border-primary/50 focus:bg-background transition-all pl-4 text-lg"
                                        />
                                    </div>
                                </div>

                                {/* Handle Input */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="handle" className="text-sm font-medium ml-1">
                                            Unique Handle
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="inline ml-1.5 h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right">
                                                        <p>Unique identifier for your organization URL</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Label>
                                        <span className={cn(
                                            "text-xs font-medium px-2 py-0.5 rounded-full capitalize transition-colors duration-300",
                                            statusState === 'available' && "bg-green-500/10 text-green-500",
                                            statusState === 'taken' && "bg-red-500/10 text-red-500",
                                            (statusState === 'reserved' || statusState === 'official') && "bg-amber-500/10 text-amber-500",
                                            statusState === 'checking' && "text-muted-foreground",
                                            statusState === 'idle' && "opacity-0"
                                        )}>
                                            {statusState}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="handle"
                                            placeholder="acme-industries"
                                            value={handle}
                                            onChange={setHandle}
                                            className={cn(
                                                "h-12 bg-secondary/30 border-secondary focus:bg-background transition-all pl-4 pr-12 font-mono text-base tracking-tight",
                                                statusState === 'available' && "border-green-500/50 focus:border-green-500 focus:ring-green-500/20",
                                                statusState === 'taken' && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
                                                (statusState === 'reserved' || statusState === 'official') && "border-amber-500/50 focus:border-amber-500 focus:ring-amber-500/20",
                                            )}
                                        />

                                        {/* Status Icon */}
                                        <div className="absolute right-4 top-3.5 transition-all duration-300">
                                            {(statusState === 'checking' || statusState === 'typing') && (
                                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                            )}
                                            {statusState === 'available' && (
                                                <Check className="h-5 w-5 text-green-500 animate-in zoom-in duration-300" />
                                            )}
                                            {statusState === 'taken' && (
                                                <X className="h-5 w-5 text-red-500 animate-in zoom-in duration-300" />
                                            )}
                                            {(statusState === 'reserved' || statusState === 'official') && (
                                                <Lock className="h-5 w-5 text-amber-500 animate-in zoom-in duration-300" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Message */}
                                    <div className="h-6 overflow-hidden">
                                        {statusState === 'available' && (
                                            <p className="text-xs text-green-500 flex items-center animate-in slide-in-from-top-1">
                                                <Check className="w-3 h-3 mr-1" />
                                                {redemptionKey ? "Key valid! Handle unlocked." : "Available for registration"}
                                            </p>
                                        )}
                                        {statusState === 'taken' && (
                                            <p className="text-xs text-red-500 flex items-center animate-in slide-in-from-top-1">
                                                <ShieldAlert className="w-3 h-3 mr-1" /> This handle is already taken
                                            </p>
                                        )}
                                        {statusState === 'official' && (
                                            <p className="text-xs text-muted-foreground flex items-center animate-in slide-in-from-top-1">
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
                                            <p className="text-xs text-amber-500 flex items-center animate-in slide-in-from-top-1">
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
                                        <div className="animate-in fade-in slide-in-from-top-1 pt-1">
                                            <Badge variant="outline" className={cn(
                                                "text-[10px] font-mono border-opacity-20",
                                                statusState === 'available'
                                                    ? "border-green-500/30 bg-green-500/5 text-green-600"
                                                    : "border-primary/20 bg-primary/5 text-primary"
                                            )}>
                                                <Key className="w-3 h-3 mr-1" />
                                                Key detected: {redemptionKey.substring(0, 4)}...
                                            </Badge>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <div className="grid grid-cols-2 gap-3">
                                    {CATEGORIES.map((cat) => (
                                        <Badge
                                            key={cat}
                                            variant="outline"
                                            className={cn(
                                                "py-3 px-4 justify-center cursor-pointer transition-all duration-200 text-xs font-medium border-border/60 hover:border-primary/50 hover:bg-primary/5",
                                                category === cat && "bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-md shadow-primary/20 scale-[1.02]"
                                            )}
                                            onClick={() => setCategory(cat)}
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                <div className="grid grid-cols-2 gap-4">
                                    {BUSINESS_TYPES.map(({ label, icon: Icon }) => (
                                        <div
                                            key={label}
                                            onClick={() => setBusinessType(label)}
                                            className={cn(
                                                "group flex flex-col items-center justify-center p-6 rounded-2xl border transition-all cursor-pointer duration-300",
                                                businessType === label
                                                    ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 relative overflow-hidden"
                                                    : "border-border/40 bg-card/40 hover:border-primary/30 hover:bg-accent/40"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-14 w-14 rounded-full flex items-center justify-center mb-4 transition-all duration-300 shadow-sm",
                                                businessType === label
                                                    ? "bg-primary text-primary-foreground scale-110 shadow-primary/30"
                                                    : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                            )}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-semibold text-center transition-colors",
                                                businessType === label ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                            )}>
                                                {label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 px-10 h-11 text-base font-semibold transition-all hover:scale-[1.02] active:scale-95"
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
