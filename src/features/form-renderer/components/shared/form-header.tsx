import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormContactActions } from "./form-contact-actions";
import { Typography } from "@/components/ui/typography";
import { ContactInfo } from "@/lib/types";
import { NOTCH_COLOR, NOTCH_SIZE } from "./form-layout";

interface FormHeaderProps {
    orgName?: string;
    orgImage?: string;
    orgHandle?: string;
    contactInfo?: ContactInfo;
    tags?: string[];
    serviceSelected?: boolean;
    onReset?: () => void;
    focusedField?: string | null;
    className?: string;
    isReadOnly?: boolean;
    showActions?: boolean;
    notchSize?: number;
    notchColor?: string;
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
    notchSize = NOTCH_SIZE,
    notchColor = NOTCH_COLOR,
    showActions = true,
    showProfile = true,
}: FormHeaderProps) {
    return (
        <div className={`flex flex-row w-full h-[80px] shrink-0 items-center overflow-hidden ${className} bg-white`}>
            {/* Left Section: Profile Info */}
            {showProfile ? (
                <div className="flex-1 bg-white h-full relative">
                    {/* Intentional white notch - only in corner to prevent bleeding at edges */}
                    <div className={`absolute top-0 right-0 w-[${notchSize}px] h-[${notchSize}px] bg-${notchColor} z-0`} />
                    <div className={`relative z-10 flex-1 flex flex-row gap-4 items-center px-6 transition-all duration-300 rounded-tr-[30px] p-2 ${focusedField === 'profile' ? "bg-black/5" : ""} bg-white h-full`}>
                        <Avatar className="h-14 w-14 ring-2 ring-black/5 shrink-0">
                            <AvatarImage src={orgImage} className="object-cover" />
                            <AvatarFallback className="bg-black/5 text-gray-900">
                                {orgName?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col min-w-0">
                            <Typography variant="subheading" as="h1" className="text-gray-900 truncate">
                                {orgName}
                            </Typography>
                            {tags.length > 0 && (
                                <Typography variant="caption" as="p" className="text-muted-foreground truncate">
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
                <div className="h-full flex items-center bg-white">
                    <FormContactActions
                        contactInfo={contactInfo}
                        serviceSelected={serviceSelected}
                        onReset={onReset}
                        notchSize={notchSize}
                        notchColor={notchColor}
                        focusedField={focusedField}
                        isReadOnly={isReadOnly}
                    />
                </div>
            )}
        </div>
    );
}
