import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FormSocialLinks } from "./form-social-links";
import { FormProperties, SocialLinks } from "@/lib/types";
import Image from "next/image";

interface FormSidebarProps {
    orgName: string;
    orgImage?: string;
    properties?: FormProperties;
    focusedField?: string | null;
    className?: string;
    isReadOnly?: boolean;
    scale?: number;
    orgHandle?: string;
}

export function FormSidebar({
    orgName,
    orgImage,
    properties,
    focusedField,
    className = "",
    isReadOnly = false,
    scale = 1,
    orgHandle,
}: FormSidebarProps) {
    const description = properties?.description || "Description text will appear here.";
    const tags = properties?.tags || [];
    const socialLinks = properties?.socialLinks;

    return (
        <div className={`flex flex-col h-full ${className} select-none`}>
            <div
                className="p-10 flex flex-col flex-1 lg:px-16 xl:px-24"
                style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100 / scale}%` }}
            >
                {/* Profile Header */}
                <div className="flex flex-row gap-4 items-center">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={orgImage} className="object-cover" />
                        <AvatarFallback>{orgName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm text-gray-900 min-w-0">
                        <p className="font-semibold text-xl truncate">{orgName}</p>
                        {tags.length > 0 && <p className="text-sm opacity-70">{tags.join(" | ")}</p>}
                    </div>
                </div>

                {/* Desc & Socials */}
                <div className="mt-24 flex flex-col">
                    <div
                        className={`flex flex-wrap gap-3 mb-2 transition-all duration-300 rounded px-2 -ml-2 py-1 ${focusedField === "title" ? "ring-2 ring-amber-400 bg-black/5" : ""
                            }`}
                    >
                        {properties?.title && (
                            <span className="text-2xl font-medium text-gray-900">
                                {properties.title}
                            </span>
                        )}
                    </div>
                    <div
                        className={`w-full transition-all duration-300 rounded-lg ${focusedField === "description"
                            ? "ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] bg-black/5"
                            : ""
                            }`}
                    >
                        <span className="text-base text-gray-900/90 leading-relaxed block">
                            {description}
                        </span>
                    </div>

                    <FormSocialLinks
                        socialLinks={socialLinks}
                        focusedField={focusedField}
                        isReadOnly={isReadOnly}
                        className="mt-8 scale-110 origin-left"
                    />
                </div>
            </div>
            {/* Powered By Footer */}
            <div className="mt-auto flex justify-center pb-6 gap-2 text-gray-900">
                <Image src="/opendm.png" alt="OpenDM" width={12} height={12} className="object-contain opacity-40" />
                <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity cursor-default">
                    <span className="text-sm">opendm.io/{orgHandle}</span>
                </div>
            </div>
        </div>
    );
}
