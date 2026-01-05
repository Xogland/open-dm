import React from "react";
import {
    GlobeIcon,
    CalendarDaysIcon,
    Mail,
    Phone,
    UserIcon,
} from "lucide-react";
import {
    TbBrandGithub,
    TbBrandMedium,
    TbBrandPinterest,
    TbBrandLinkedin,
    TbBrandDribbble,
    TbBrandTwitch,
    TbBrandX,
    TbBrandInstagram,
    TbBrandYoutube,
    TbBrandFacebook,
    TbBrandTiktok,
    TbBrandDiscord,
    TbBrandTelegram,
    TbBrandWhatsapp,
    TbBrandReddit,
    TbBrandThreads,
    TbBrandBluesky,
    TbBrandMastodon,
    TbBrandBehance,
    TbBrandStackoverflow,
    TbBrandPatreon,
    TbBrandSpotify,
    TbBrandFigma,
    TbBrandSnapchat,
    TbBrandMessenger,
    TbBrandSlack,
    TbBrandSkype,
    TbBrandPaypal,
    TbBrandSoundcloud,
    TbBrandVimeo,
    TbBrandApple,
    TbBrandGoogle,
    TbBrandSteam,
    TbBrandLinktree,
    TbBrandBilibili,
    TbBrandProducthunt,
    TbBrandOnlyfans,
    TbBrandVsco,
    TbBrandCashapp,
    TbXboxX,
    TbPlaystationX,
    TbWorld,
    TbBrandZoom,
} from "react-icons/tb";

/**
 * Icon mapping for contact methods.
 * Used in chat view and preview components.
 */
export const CONTACT_ICONS = {
    profile: UserIcon,
    phone: Phone,
    email: Mail,
    website: GlobeIcon,
    calendarLink: CalendarDaysIcon,
};

export interface SocialPlatform {
    name: string;
    label: string;
    icon: React.ReactNode;
    iconComponent: React.ComponentType; // The component itself for rendering
}

/**
 * Comprehensive list of social platforms with their icons.
 * Used across the application for consistency.
 * 
 * - `icon`: JSX icon element (used in form editor select dropdown)
 * - `iconComponent`: Icon component (used for rendering in chat/preview)
 */
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
    { name: "twitter", label: "X", icon: <TbBrandX className="w-4 h-4" />, iconComponent: TbBrandX },
    { name: "instagram", label: "Instagram", icon: <TbBrandInstagram className="w-4 h-4" />, iconComponent: TbBrandInstagram },
    { name: "youtube", label: "YouTube", icon: <TbBrandYoutube className="w-4 h-4" />, iconComponent: TbBrandYoutube },
    { name: "facebook", label: "Facebook", icon: <TbBrandFacebook className="w-4 h-4" />, iconComponent: TbBrandFacebook },
    { name: "messenger", label: "Messenger", icon: <TbBrandMessenger className="w-4 h-4" />, iconComponent: TbBrandMessenger },
    { name: "whatsapp", label: "WhatsApp", icon: <TbBrandWhatsapp className="w-4 h-4" />, iconComponent: TbBrandWhatsapp },
    { name: "snapchat", label: "Snapchat", icon: <TbBrandSnapchat className="w-4 h-4" />, iconComponent: TbBrandSnapchat },
    { name: "tiktok", label: "TikTok", icon: <TbBrandTiktok className="w-4 h-4" />, iconComponent: TbBrandTiktok },
    { name: "linkedin", label: "LinkedIn", icon: <TbBrandLinkedin className="w-4 h-4" />, iconComponent: TbBrandLinkedin },
    { name: "discord", label: "Discord", icon: <TbBrandDiscord className="w-4 h-4" />, iconComponent: TbBrandDiscord },
    { name: "telegram", label: "Telegram", icon: <TbBrandTelegram className="w-4 h-4" />, iconComponent: TbBrandTelegram },
    { name: "slack", label: "Slack", icon: <TbBrandSlack className="w-4 h-4" />, iconComponent: TbBrandSlack },
    { name: "skype", label: "Skype", icon: <TbBrandSkype className="w-4 h-4" />, iconComponent: TbBrandSkype },
    { name: "github", label: "GitHub", icon: <TbBrandGithub className="w-4 h-4" />, iconComponent: TbBrandGithub },
    { name: "reddit", label: "Reddit", icon: <TbBrandReddit className="w-4 h-4" />, iconComponent: TbBrandReddit },
    { name: "threads", label: "Threads", icon: <TbBrandThreads className="w-4 h-4" />, iconComponent: TbBrandThreads },
    { name: "bluesky", label: "Bluesky", icon: <TbBrandBluesky className="w-4 h-4" />, iconComponent: TbBrandBluesky },
    { name: "mastodon", label: "Mastodon", icon: <TbBrandMastodon className="w-4 h-4" />, iconComponent: TbBrandMastodon },
    { name: "medium", label: "Medium", icon: <TbBrandMedium className="w-4 h-4" />, iconComponent: TbBrandMedium },
    { name: "linktree", label: "Linktree", icon: <TbBrandLinktree className="w-4 h-4" />, iconComponent: TbBrandLinktree },
    { name: "pinterest", label: "Pinterest", icon: <TbBrandPinterest className="w-4 h-4" />, iconComponent: TbBrandPinterest },
    { name: "dribbble", label: "Dribbble", icon: <TbBrandDribbble className="w-4 h-4" />, iconComponent: TbBrandDribbble },
    { name: "behance", label: "Behance", icon: <TbBrandBehance className="w-4 h-4" />, iconComponent: TbBrandBehance },
    { name: "figma", label: "Figma", icon: <TbBrandFigma className="w-4 h-4" />, iconComponent: TbBrandFigma },
    { name: "producthunt", label: "Product Hunt", icon: <TbBrandProducthunt className="w-4 h-4" />, iconComponent: TbBrandProducthunt },
    { name: "twitch", label: "Twitch", icon: <TbBrandTwitch className="w-4 h-4" />, iconComponent: TbBrandTwitch },
    { name: "stackoverflow", label: "Stack Overflow", icon: <TbBrandStackoverflow className="w-4 h-4" />, iconComponent: TbBrandStackoverflow },
    { name: "patreon", label: "Patreon", icon: <TbBrandPatreon className="w-4 h-4" />, iconComponent: TbBrandPatreon },
    { name: "buymeacoffee", label: "Buy Me a Coffee", icon: <GlobeIcon className="w-4 h-4" />, iconComponent: GlobeIcon },
    { name: "paypal", label: "PayPal", icon: <TbBrandPaypal className="w-4 h-4" />, iconComponent: TbBrandPaypal },
    { name: "cashapp", label: "Cash App", icon: <TbBrandCashapp className="w-4 h-4" />, iconComponent: TbBrandCashapp },
    { name: "spotify", label: "Spotify", icon: <TbBrandSpotify className="w-4 h-4" />, iconComponent: TbBrandSpotify },
    { name: "soundcloud", label: "SoundCloud", icon: <TbBrandSoundcloud className="w-4 h-4" />, iconComponent: TbBrandSoundcloud },
    { name: "bilibili", label: "Bilibili", icon: <TbBrandBilibili className="w-4 h-4" />, iconComponent: TbBrandBilibili },
    { name: "vsco", label: "VSCO", icon: <TbBrandVsco className="w-4 h-4" />, iconComponent: TbBrandVsco },
    { name: "vimeo", label: "Vimeo", icon: <TbBrandVimeo className="w-4 h-4" />, iconComponent: TbBrandVimeo },
    { name: "apple", label: "Apple", icon: <TbBrandApple className="w-4 h-4" />, iconComponent: TbBrandApple },
    { name: "google", label: "Google", icon: <TbBrandGoogle className="w-4 h-4" />, iconComponent: TbBrandGoogle },
    { name: "steam", label: "Steam", icon: <TbBrandSteam className="w-4 h-4" />, iconComponent: TbBrandSteam },
    { name: "xbox", label: "Xbox", icon: <TbXboxX className="w-4 h-4" />, iconComponent: TbXboxX },
    { name: "playstation", label: "PlayStation", icon: <TbPlaystationX className="w-4 h-4" />, iconComponent: TbPlaystationX },
    { name: "onlyfans", label: "OnlyFans", icon: <TbBrandOnlyfans className="w-4 h-4" />, iconComponent: TbBrandOnlyfans },
];

/**
 * Helper function to get social icon as Record for mapping.
 * Returns the same icon components for all views (consistent styling).
 */
export const getSocialIconsMap = (): Record<string, React.ComponentType> => {
    const iconMap: Record<string, React.ComponentType> = {};

    SOCIAL_PLATFORMS.forEach(platform => {
        iconMap[platform.name] = platform.iconComponent;
    });

    // Add default fallback
    iconMap.default = TbWorld;

    return iconMap;
};

export const CALENDAR_PLATFORMS = [
    { id: 'calendly', name: 'Calendly', icon: CalendarDaysIcon, domains: ['calendly.com'] },
    { id: 'google', name: 'Google Calendar', icon: TbBrandGoogle, domains: ['calendar.google.com', 'goo.gl/calendar'] },
    { id: 'zoho', name: 'Zoho Calendar', icon: GlobeIcon, domains: ['calendar.zoho', 'zoho.com/calendar'] },
    { id: 'zoom', name: 'Zoom Calendar', icon: TbBrandZoom, domains: ['zoom.us', 'zoom.com'] },
];

export const getCalendarIcon = (url?: string) => {
    if (!url) return CalendarDaysIcon;
    const lowUrl = url.toLowerCase();
    const platform = CALENDAR_PLATFORMS.find(p => p.domains.some(d => lowUrl.includes(d)));
    return platform ? platform.icon : CalendarDaysIcon;
};
