export enum PlatformStatus {
    PREREGISTRATION = "preregistration",
    LIVE = "live",
    MAINTENANCE = "maintenance",
}

export const CURRENT_PLATFORM_STATUS: PlatformStatus = PlatformStatus.LIVE;

// Global launch date
export const LAUNCH_DATE = new Date("2027-01-01T00:00:00Z");
