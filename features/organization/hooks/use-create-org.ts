import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserAuth } from "@/features/auth/providers/user-auth-provider";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { HandleState } from "@/features/organization/components/handle-input";

export function useCreateOrg() {
    const { user } = useUserAuth();
    const { setSelectedOrganization } = useUserData();
    const router = useRouter();
    const createOrganization = useMutation(api.organisation.createOrganisation);

    const [organisationName, setOrganisationName] = useState("");
    const [handle, setHandle] = useState("");
    const [handleStatus, setHandleStatus] = useState<HandleState>(HandleState.idle);
    const [loading, setLoading] = useState(false);
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

    useEffect(() => {
        setOrganisationName(user?.name ?? "");
    }, [user]);

    const isFormValid = organisationName.trim() !== "" && handleStatus === HandleState.available;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (isFormValid) {
            try {
                const organizationId = await createOrganization({
                    name: organisationName,
                    handle: handle,
                });

                if (!organizationId) {
                    toast.error("Failed to create organization");
                    return;
                }
                setSelectedOrganization(organizationId);
                router.replace("/dashboard");
                toast.success("Organization created successfully");
            } catch (error: any) {
                if (error.message.includes("Limit Reached")) {
                    setUpgradeDialogOpen(true);
                } else {
                    toast.error("Failed to create organization");
                    console.error(error);
                }
            }
        }
        setLoading(false);
    };

    return {
        organisationName,
        setOrganisationName,
        handle,
        setHandle,
        handleStatus,
        setHandleStatus,
        loading,
        upgradeDialogOpen,
        setUpgradeDialogOpen,
        isFormValid,
        handleSubmit,
    };
}
