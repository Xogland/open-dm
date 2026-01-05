"use client";

import { PageHeader } from "@/components/page-header";
import { useOrgSettings } from "../hooks/use-org-settings";
import { OrgProfileForm } from "./org-profile-form";
import { OrgStatusesForm } from "./org-statuses-form";
import { OrgDangerZone } from "./org-danger-zone";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/page-shell";
import { Typography } from "@/components/ui/typography";

export default function OrganizationSettingsPage() {
    const {
        organization,
        name,
        setName,
        isUploading,
        handleUpdateName,
        handleUpdateStatuses,
        handleImageUpload,
        isLoading
    } = useOrgSettings();

    if (isLoading) {
        return (
            <PageShell>
                <div className="space-y-8 animate-pulse">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
                        <Skeleton className="h-[500px] rounded-2xl" />
                        <Skeleton className="h-[500px] rounded-2xl" />
                    </div>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            {/* Header */}
            <PageHeader
                title="Organization Settings"
                description="Configure your organization's profile, branding, and custom submission statuses."
            />

            <div className="space-y-10 max-w-7xl w-full">
                {/* Organization Settings */}
                <section className="space-y-6">
                    <Typography variant="h4" as="h2">
                        Profile & Branding
                    </Typography>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left Pane - General Settings */}
                        <div className="space-y-6">
                            <OrgProfileForm
                                organization={organization}
                                name={name}
                                setName={setName}
                                isUploading={isUploading}
                                onUpdateName={handleUpdateName}
                                onImageUpload={handleImageUpload}
                            />

                            {organization && (
                                <OrgDangerZone
                                    organisationId={organization._id}
                                    organisationName={organization.name}
                                />
                            )}
                        </div>

                        {/* Right Pane - Statuses Settings */}
                        <div className="space-y-6">
                            {organization && (
                                <OrgStatusesForm
                                    organization={organization}
                                    onUpdateStatuses={handleUpdateStatuses}
                                />
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </PageShell>
    );
}
