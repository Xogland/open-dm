"use client";

import { PageHeader } from "@/components/page-header";
import { useUserSettings } from "../hooks/use-user-settings";
import { UserProfileForm } from "./user-profile-form";
import { UserDangerZone } from "./user-danger-zone";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/page-shell";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

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
            <div className="max-w-4xl space-y-12">
                <PageHeader
                    title="User Settings"
                    description="Manage your personal profile, security, and account preferences."
                />

                <div className="space-y-16">
                    {/* Section: Profile */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <Typography variant="h4">Personal Profile</Typography>
                            <Typography variant="caption" className="text-muted-foreground leading-relaxed">
                                Update your personal details and identity information.
                            </Typography>
                        </div>
                        <div className="md:col-span-2">
                            <UserProfileForm
                                user={user}
                                name={name}
                                setName={setName}
                                isLoading={isLoading}
                                onUpdateProfile={handleUpdateProfile}
                            />
                        </div>
                    </section>

                    <Separator className="opacity-50" />

                    {/* Section: Danger Zone */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                        <div className="space-y-1">
                            <Typography variant="h4" className="text-destructive">Danger Zone</Typography>
                            <Typography variant="caption" className="text-muted-foreground leading-relaxed">
                                Critical actions regarding your personal account.
                            </Typography>
                        </div>
                        <div className="md:col-span-2">
                            <UserDangerZone />
                        </div>
                    </section>
                </div>
            </div>
        </PageShell>
    );
}
