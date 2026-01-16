"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2, LockIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface StripeSettingsFormProps {
    organization: any;
    onSuccess?: () => void;
    hideCard?: boolean;
}

export const StripeSettingsForm = ({ organization, onSuccess, hideCard }: StripeSettingsFormProps) => {
    const isSecretKeyConfigured = !!organization?.stripeConfig?.publishableKey; // Simple heuristic since we redact secretKey

    const [publishableKey, setPublishableKey] = useState(organization?.stripeConfig?.publishableKey || "");
    const [secretKey, setSecretKey] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Keep publishable key in sync with props
    React.useEffect(() => {
        if (organization?.stripeConfig?.publishableKey) {
            setPublishableKey(organization.stripeConfig.publishableKey);
        }
    }, [organization?.stripeConfig?.publishableKey]);

    const updateStripeConfig = useMutation(api.organisation.updateOrganisationStripeConfig);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await updateStripeConfig({
                organisationId: organization._id,
                stripeConfig: {
                    publishableKey,
                    secretKey: secretKey || undefined, // Only send if not empty
                },
            });
            toast.success("Stripe configuration updated");
            setSecretKey(""); // Reset secret key field
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to update Stripe configuration");
        } finally {
            setIsSaving(false);
        }
    };

    const FormContent = (
        <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
                <Typography variant="caption" className="font-semibold">Publishable Key</Typography>
                <Input
                    placeholder="pk_test_..."
                    value={publishableKey}
                    onChange={(e) => setPublishableKey(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Typography variant="caption" className="font-semibold">Secret Key</Typography>
                    <LockIcon className="h-3 w-3 text-muted-foreground" />
                </div>
                <Input
                    type="password"
                    placeholder={isSecretKeyConfigured ? "••••••••••••" : "sk_test_..."}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required={!isSecretKeyConfigured}
                />
            </div>
            <Button type="submit" disabled={isSaving} className="w-full h-10">
                {isSaving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    "Save Stripe Configuration"
                )}
            </Button>
        </form>
    );

    if (hideCard) {
        return FormContent;
    }

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>Stripe Integration</CardTitle>
                    <CardDescription>
                        Configure your Stripe API keys to accept payments in your forms.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {FormContent}
            </CardContent>
        </Card>
    );
};
