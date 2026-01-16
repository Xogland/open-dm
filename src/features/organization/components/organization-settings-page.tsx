"use client";

import { PageHeader } from "@/components/page-header";
import { useOrgSettings } from "../hooks/use-org-settings";
import { OrgProfileForm } from "./org-profile-form";
import { OrgStatusesForm } from "./org-statuses-form";
import { OrgDangerZone } from "./org-danger-zone";
import { StripeSettingsForm } from "./stripe-settings-form";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/page-shell";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";

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
                    <div className="space-y-8">
                        <Skeleton className="h-[400px] rounded-2xl" />
                        <Skeleton className="h-[400px] rounded-2xl" />
                    </div>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <div className="max-w-5xl space-y-12">
                <PageHeader
                    title="Organization Settings"
                    description="Configure your organization's core identity, workflow, and external integrations."
                />

                <div className="space-y-16">
                    {/* Section: Profile */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <Typography variant="h4">Profile & Branding</Typography>
                            <Typography variant="caption" className="text-muted-foreground leading-relaxed">
                                Manage how your organization appears to your team and customers.
                            </Typography>
                        </div>
                        <div className="md:col-span-2">
                            <OrgProfileForm
                                organization={organization}
                                name={name}
                                setName={setName}
                                isUploading={isUploading}
                                onUpdateName={handleUpdateName}
                                onImageUpload={handleImageUpload}
                            />
                        </div>
                    </section>

                    <Separator className="opacity-50" />

                    {/* Section: Workflow */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <Typography variant="h4">Workflow Settings</Typography>
                            <Typography variant="caption" className="text-muted-foreground leading-relaxed">
                                Define custom statuses and automation rules for your submission pipeline.
                            </Typography>
                        </div>
                        <div className="md:col-span-2">
                            {organization && (
                                <OrgStatusesForm
                                    organization={organization}
                                    onUpdateStatuses={handleUpdateStatuses}
                                />
                            )}
                        </div>
                    </section>

                    <Separator className="opacity-50" />

                    {/* Section: Payments */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <Typography variant="h4">Payments & Stripe</Typography>
                            <Typography variant="caption" className="text-muted-foreground leading-relaxed">
                                Connect your Stripe account to enable payment processing on your forms.
                            </Typography>
                        </div>
                        <div className="md:col-span-2">
                            {organization && (
                                <StripeSettingsForm organization={organization} />
                            )}
                        </div>
                    </section>

                    <Separator className="opacity-50" />

                    {/* Section: Danger Zone */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                        <div className="space-y-1">
                            <Typography variant="h4" className="text-destructive">Danger Zone</Typography>
                            <Typography variant="caption" className="text-muted-foreground leading-relaxed">
                                Permanent actions that affect your entire organization data.
                            </Typography>
                        </div>
                        <div className="md:col-span-2">
                            {organization && (
                                <OrgDangerZone
                                    organisationId={organization._id}
                                    organisationName={organization.name}
                                />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </PageShell>
    );
}
