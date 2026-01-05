import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormContactActions } from "./form-contact-actions";

interface FormHeaderProps {
    orgName?: string;
    orgImage?: string;
    orgHandle?: string;
    contactInfo?: any;
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
    serviceSelected = false,
    onReset,
    focusedField,
    className = "",
    isReadOnly = false,
    showActions = true,
    showProfile = true,
}: FormHeaderProps) {
    return (
        <div className={`flex flex-row w-full h-[80px] shrink-0 items-center overflow-hidden ${className} bg-white`}>
            {/* Left Section: Profile Info */}
            {showProfile ? (
                <div className={`flex-1 flex flex-row gap-4 items-center px-6 transition-all duration-300 rounded-tr-[30px] p-2 ${focusedField === 'profile' ? "bg-white/10" : ""} bg-primary h-full`}>
                    <Avatar className="h-14 w-14 ring-2 ring-white/10 shrink-0">
                        <AvatarImage src={orgImage} className="object-cover" />
                        <AvatarFallback className="bg-white/10 text-primary-foreground font-bold">
                            {orgName?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0">
                        <h1 className="text-lg font-bold text-primary-foreground truncate leading-tight">
                            {orgName}
                        </h1>
                        {orgHandle && (
                            <p className="text-sm font-medium text-primary-foreground/60 truncate">
                                @{orgHandle}
                            </p>
                        )}
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
