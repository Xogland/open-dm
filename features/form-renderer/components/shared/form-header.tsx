import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormContactActions } from "./form-contact-actions";
import { Typography } from "@/components/ui/typography";

interface FormHeaderProps {
    orgName?: string;
    orgImage?: string;
    orgHandle?: string;
    contactInfo?: any;
    tags?: string[];
    serviceSelected?: boolean;
    onReset?: () => void;
    focusedField?: string | null;
    className?: string;
    isReadOnly?: boolean;
    showActions?: boolean;
    showProfile?: boolean;
}

export function FormHeader({
    orgName,
    orgImage,
    orgHandle,
    contactInfo,
    tags = [],
    serviceSelected = false,
    onReset,
    focusedField,
    className = "",
    isReadOnly = false,
    showActions = true,
    showProfile = true,
}: FormHeaderProps) {
    return (
        <div className={`flex flex-row w-full h-[80px] shrink-0 items-center overflow-hidden ${className} bg-primary`}>
            {/* Left Section: Profile Info */}
            {showProfile ? (
                <div className="flex-1 bg-primary h-full relative">
                    {/* Intentional white notch - only in corner to prevent bleeding at edges */}
                    <div className="absolute top-0 right-0 w-[40px] h-[40px] bg-white z-0" />
                    <div className={`relative z-10 flex-1 flex flex-row gap-4 items-center px-6 transition-all duration-300 rounded-tr-[30px] p-2 ${focusedField === 'profile' ? "bg-white/10" : ""} bg-primary h-full`}>
                        <Avatar className="h-14 w-14 ring-2 ring-white/10 shrink-0">
                            <AvatarImage src={orgImage} className="object-cover" />
                            <AvatarFallback className="bg-white/10 text-primary-foreground">
                                {orgName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col min-w-0">
                            <Typography variant="subheading" as="h1" className="text-primary-foreground truncate">
                                {orgName}
                            </Typography>
                            {tags.length > 0 && (
                                <Typography variant="caption" as="p" className="text-primary-foreground/60 truncate">
                                    {tags.join(" | ")}
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1" />
            )}

            {/* Right Section: Actions */}
            {showActions && (
                <div className="h-full flex items-center bg-primary">
                    <FormContactActions
                        contactInfo={contactInfo}
                        serviceSelected={serviceSelected}
                        onReset={onReset}
                        focusedField={focusedField}
                        isReadOnly={isReadOnly}
                    />
                </div>
            )}
        </div>
    );
}
