"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Send, AlertCircle, CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    TextStep,
    EmailStep,
    PhoneStep,
    AddressStep,
    WebsiteStep,
    NumberStep,
    DateStep,
    FileStep,
    WorkflowStep
} from "@/lib/types";
import {
    validateEmail,
    validatePhone,
    validateWebsite,
    validateTextInput,
    validateNumberInput,
    validateFileUpload
} from "@/lib/message-types";

interface DynamicBottomInputProps {
    currentStep: WorkflowStep | null;
    isSubmitting: boolean;
    onSend: (value: string | Date | File) => void;
    overrideType?: string;
}

export function DynamicBottomInput({ currentStep, isSubmitting, onSend, overrideType }: DynamicBottomInputProps) {
    const [value, setValue] = useState("");
    const [dateValue, setDateValue] = useState<Date | undefined>();
    const [fileValue, setFileValue] = useState<File | null>(null);
    const [error, setError] = useState<string | undefined>();
    const [countryCode, setCountryCode] = useState("+1");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when step changes
    useEffect(() => {
        setValue("");
        setDateValue(undefined);
        setFileValue(null);
        setError(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [currentStep?.id, overrideType]);

    const stepType = overrideType || currentStep?.stepType;

    const handleSubmit = () => {
        if (isSubmitting) return;

        let validation: { valid: boolean; error?: string } = { valid: true };
        let finalValue: string | Date | File = value;

        switch (stepType) {
            case 'email':
            case 'email_input':
                const emailStep = currentStep as EmailStep;
                validation = validateEmail(value, emailStep?.required);
                break;
            case 'phone':
            case 'phone_input':
                const phoneStep = currentStep as PhoneStep;
                finalValue = `${countryCode}${value}`;
                validation = validatePhone(finalValue, phoneStep?.required);
                break;
            case 'website':
            case 'website_input':
                const websiteStep = currentStep as WebsiteStep;
                validation = validateWebsite(value, websiteStep?.required);
                break;
            case 'number':
            case 'number_input':
                const numberStep = currentStep as NumberStep;
                validation = validateNumberInput(value, numberStep?.min, numberStep?.max);
                break;
            case 'text':
            case 'text_input':
                const textStep = currentStep as TextStep;
                validation = validateTextInput(value, textStep?.minLength, textStep?.maxLength);
                break;
            case 'address':
            case 'address_input':
                const addressStep = currentStep as AddressStep;
                validation = validateTextInput(value, addressStep?.required ? 1 : 0);
                break;
            case 'date':
            case 'date_input':
                if (!dateValue) {
                    validation = { valid: false, error: "Please select a date" };
                }
                finalValue = dateValue as Date;
                break;
            case 'file':
            case 'file_upload':
                const fileStep = currentStep as FileStep;
                if (!fileValue) {
                    validation = { valid: false, error: "Please upload a file" };
                } else {
                    validation = validateFileUpload(fileValue, fileStep?.acceptedTypes, fileStep?.maxSize);
                }
                finalValue = fileValue as File;
                break;
            default:
                return;
        }

        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        onSend(finalValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileValue(file);
            setError(undefined);
        }
    };

    // Determine disabled state
    let isDisabled = isSubmitting;
    let placeholder = "Type your answer...";
    let isInteractionEnabled = true;

    if (!stepType || ['service_selection', 'multiple_choice', 'end_screen'].includes(stepType)) {
        isDisabled = true;
        isInteractionEnabled = false;

        if (stepType === 'service_selection') placeholder = "Please select a service above";
        else if (stepType === 'multiple_choice') placeholder = "Please select an option above";
        else if (stepType === 'end_screen') placeholder = "Conversation ended";
    } else {
        const step = currentStep as TextStep;
        placeholder = step?.placeholder || "Type your answer...";
    }

    return (
        <div className="p-4 pt-0 w-full animate-in slide-in-from-bottom-2 duration-300">
            {error && (
                <div className="flex items-center text-red-500 text-xs mb-2 px-1">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {error}
                </div>
            )}

            <div className="flex gap-2 items-end">
                {stepType === 'phone' && !isDisabled && (
                    <Select value={countryCode} onValueChange={setCountryCode} disabled={isDisabled}>
                        <SelectTrigger className="w-[80px] h-12 focus:ring-primary/20">
                            <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="+1">🇺🇸 +1</SelectItem>
                            <SelectItem value="+44">🇬🇧 +44</SelectItem>
                            <SelectItem value="+91">🇮🇳 +91</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                <div className="relative flex-1">
                    {(stepType === 'date' || stepType === 'date_input') ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-12 justify-start text-left font-normal",
                                        !dateValue && "text-muted-foreground"
                                    )}
                                    disabled={isDisabled}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dateValue ? format(dateValue, "PPP") : (currentStep?.question?.includes("date") ? "Pick a date" : "Select date")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="center">
                                <Calendar
                                    mode="single"
                                    selected={dateValue}
                                    onSelect={(d) => { setDateValue(d); setError(undefined); }}
                                    disabled={(date) => {
                                        const step = currentStep as DateStep;
                                        if (step?.minDate && date < new Date(step.minDate)) return true;
                                        if (step?.maxDate && date > new Date(step.maxDate)) return true;
                                        return false;
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    ) : (stepType === 'file' || stepType === 'file_upload') ? (
                        <div className="flex gap-2 items-center w-full">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept={(currentStep as FileStep)?.acceptedTypes?.join(',')}
                            />
                            <Button
                                variant="outline"
                                className="flex-1 h-12 justify-start text-muted-foreground"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isDisabled}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {fileValue ? fileValue.name : "Choose a file..."}
                            </Button>
                            {fileValue && (
                                <Button variant="ghost" size="icon" onClick={() => { setFileValue(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ) : (stepType === 'address' || (stepType === 'text' && (currentStep as TextStep)?.multiline)) ? (
                        <Textarea
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setError(undefined);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={isDisabled}
                            className={cn(
                                "min-h-[48px] max-h-[120px] w-full resize-none focus:border-primary focus:ring-primary/20 rounded-xl px-4 py-3 pr-12 shadow-sm text-base custom-scrollbar bg-white border-gray-300 text-gray-900",
                                isDisabled && "opacity-50 cursor-not-allowed"
                            )}
                            rows={1}
                        />
                    ) : (
                        <Input
                            type={stepType === 'number' ? 'number' : stepType === 'email' ? 'email' : stepType === 'website' ? 'url' : 'text'}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setError(undefined);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            disabled={isDisabled}
                            className={cn(
                                "h-12 w-full focus:border-primary focus:ring-primary/20 rounded-xl px-4 pr-12 shadow-sm text-base bg-white border border-gray-300 text-gray-900",
                                isDisabled && "opacity-50 cursor-not-allowed"
                            )}
                        />
                    )}

                    {!isDisabled && isInteractionEnabled && (
                        <Button
                            size="icon"
                            onClick={handleSubmit}
                            disabled={isSubmitting || (!value && !dateValue && !fileValue)}
                            className="absolute right-2 bottom-2 h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
