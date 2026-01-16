import React from "react";
import { HomeIcon } from "lucide-react";
import { CONTACT_ICONS, getCalendarIcon } from "@/constants/social-platforms";
import { ContactInfo } from "@/lib/types";
import { toast } from "sonner";
import { NOTCH_COLOR, NOTCH_SIZE } from "./form-layout";

interface FormContactActionsProps {
    contactInfo?: ContactInfo;
    serviceSelected: boolean;
    onReset?: () => void;
    focusedField?: string | null;
    className?: string;
    isReadOnly?: boolean;
    notchSize?: number;
    notchColor?: string;
    scale?: number;
}

export function FormContactActions({
    contactInfo,
    serviceSelected,
    onReset,
    focusedField,
    className = "",
    isReadOnly = false,
    notchSize = NOTCH_SIZE,
    notchColor = NOTCH_COLOR,
    scale = 1,
}: FormContactActionsProps) {
    const handleAction = async (type: string, value: string) => {
        if (isReadOnly) {
            if (type === "profile") {
                navigator.clipboard.writeText(value);
                toast.success("Profile link copied!");
            }
            return;
        }

        switch (type) {
            case "profile":
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Profile',
                            url: value
                        });
                    } catch (err) {
                        // User cancelled or failed, fallback to copy
                        navigator.clipboard.writeText(value);
                        toast.success("Profile link copied!");
                    }
                } else {
                    navigator.clipboard.writeText(value);
                    toast.success("Profile link copied!");
                }
                break;
            case "phone":
                window.open(`tel:${value}`);
                break;
            case "email":
                window.open(`mailto:${value}`);
                break;
            case "website":
                window.open(value.startsWith("http") ? value : `https://${value}`, "_blank");
                break;
            case "calendarLink":
                window.open(value.startsWith("http") ? value : `https://${value}`, "_blank");
                break;
        }
    };

    const validContacts = [
        { type: "profile", value: contactInfo?.profile },
        { type: "phone", value: contactInfo?.phone },
        { type: "email", value: contactInfo?.email },
        { type: "website", value: contactInfo?.website },
        { type: "calendarLink", value: contactInfo?.calendarLink },
    ].filter((c) => c.value && typeof c.value === "string" && c.value.trim() !== "");

    const visibleContacts = validContacts.slice(0, 2);

    return (
        <div className="h-full bg-white relative">
            <div
                className={`h-full gap-2 flex flex-row items-center justify-center px-4 py-3 rounded-bl-[${notchSize}px] bg-${notchColor} text-gray-900 transition-all duration-300 ${className} ${(scale !== 1 ? " shadow-[0_0_0_1px_white]" : "")}`}
                style={scale !== 1 ? { transform: `scale(${scale})`, transformOrigin: 'top right' } : {}}
            >
                {serviceSelected ? (
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center w-10 h-10 border border-transparent rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                        title="Reset Chat"
                    >
                        <HomeIcon className="w-5 h-5" />
                    </button>
                ) : (
                    <>
                        {visibleContacts.map((contact, idx) => {
                            const Icon =
                                contact.type === "calendarLink"
                                    ? getCalendarIcon(contact.value as string)
                                    : CONTACT_ICONS[contact.type as keyof typeof CONTACT_ICONS];
                            const isFocused = focusedField === `contact-${contact.type}`;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAction(contact.type!, contact.value!)}
                                    className={`flex items-center justify-center w-10 h-10 bg-white border border-border rounded-full text-gray-900 transition-all duration-300 ${isFocused
                                        ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white shadow-lg scale-110"
                                        : "hover:text-primary hover:bg-muted"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                </button>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}
