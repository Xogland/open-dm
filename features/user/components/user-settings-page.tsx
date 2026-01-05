"use client";

import { PageHeader } from "@/components/page-header";
import { useUserSettings } from "../hooks/use-user-settings";
import { UserProfileForm } from "./user-profile-form";
import { UserDangerZone } from "./user-danger-zone";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/page-shell";

export default function UserSettingsPage() {
    const {
        user,
        name,
        setName,
        isLoading,
        handleUpdateProfile
    } = useUserSettings();

    if (!user) {
        return (
            <PageShell>
                <div className="space-y-8 animate-pulse">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-[300px] max-w-2xl rounded-2xl" />
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            {/* Header */}
            <PageHeader
                title="User Settings"
                description="Manage your personal profile and account preferences."
            />

            <div className="max-w-4xl space-y-8">
                <UserProfileForm
                    user={user}
                    name={name}
                    setName={setName}
                    isLoading={isLoading}
                    onUpdateProfile={handleUpdateProfile}
                />

                <UserDangerZone />
            </div>
        </PageShell>
    );
}
