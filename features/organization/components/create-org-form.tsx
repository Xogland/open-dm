"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import HandleInput, { HandleState } from "@/features/organization/components/handle-input";

interface CreateOrgFormProps {
    organisationName: string;
    setOrganisationName: (name: string) => void;
    handle: string;
    setHandle: (handle: string) => void; // HandleInput usually returns string directly
    // Adjust setHandle signature if HandleInput uses ChangeEvent
    setHandleStatus: (status: HandleState) => void;
    loading: boolean;
    upgradeDialogOpen: boolean;
    setUpgradeDialogOpen: (open: boolean) => void;
    isFormValid: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function CreateOrgForm({
    organisationName,
    setOrganisationName,
    handle,
    setHandle,
    setHandleStatus,
    loading,
    upgradeDialogOpen,
    setUpgradeDialogOpen,
    isFormValid,
    onSubmit,
}: CreateOrgFormProps) {
    return (
        <div className="flex items-center justify-center h-full p-4 sm:p-8">
            <Card className="w-full max-w-lg shadow-xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl">
                        Create Your Organization
                    </CardTitle>
                </CardHeader>

                <form onSubmit={onSubmit}>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="org-name">Organization Name</Label>
                            <Input
                                id="org-name"
                                placeholder="e.g., Stellar Innovations Inc."
                                required
                                value={organisationName}
                                onChange={(e) => setOrganisationName(e.target.value)}
                            />
                            <p className="text-sm text-gray-500">
                                This will be the full, public name of your organization.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="handle">Organization Handle</Label>
                            <HandleInput
                                initialHandle={handle}
                                onStatusChange={(status, h) => {
                                    setHandleStatus(status);
                                    setHandle(h);
                                }}
                            />
                            <p className="text-sm text-gray-500">
                                Unique identifier for your organization (e.g. app.com/handle).
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-center mt-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!isFormValid || loading}
                        >
                            {loading ? "Creating..." : "Create Organization"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
            <UpgradeDialog
                open={upgradeDialogOpen}
                onOpenChange={setUpgradeDialogOpen}
                title="Organization Limit Reached"
                description="You've reached the limit of organizations for your current plan. Upgrade to create more."
            />
        </div>
    );
}
