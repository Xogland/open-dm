import React from "react";
import { getSocialIconsMap } from "@/constants/social-platforms";
import { SocialLinks } from "@/lib/types";

const SOCIAL_ICONS = getSocialIconsMap();

interface FormSocialLinksProps {
    socialLinks?: SocialLinks;
    focusedField?: string | null;
    className?: string;
    isReadOnly?: boolean;
    scale?: number;
}

export function FormSocialLinks({
    socialLinks,
    focusedField,
    className = "",
    isReadOnly = false,
    scale = 1,
}: FormSocialLinksProps) {
    if (!socialLinks || Object.keys(socialLinks).length === 0) return null;

    const isFocused = focusedField === "socialLinks";
    const links = socialLinks as Record<string, string | undefined>;

    return (
        <div
            className={`flex flex-row gap-4 items-center justify-center sm:justify-start mt-4 text-xl flex-wrap px-4 sm:px-0 transition-all duration-300 rounded-xl p-2 ${isFocused
                ? "ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] bg-black/5"
                : ""
                } ${className}`}
            style={scale !== 1 ? { transform: `scale(${scale})`, transformOrigin: "center left" } : {}}
        >
            {Object.entries(links).map(([platform, link]) => {
                if (!link) return null;
                const Icon = SOCIAL_ICONS[platform] || SOCIAL_ICONS.default;

                if (isReadOnly) {
                    return (
                        <div
                            key={platform}
                            className="text-gray-900 hover:opacity-80 transition-opacity"
                        >
                            <Icon />
                        </div>
                    );
                }

                return (
                    <a
                        key={platform}
                        href={link.startsWith("http") ? link : `https://${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:opacity-80 transition-opacity"
                    >
                        <Icon />
                    </a>
                );
            })}
        </div>
    );
}
