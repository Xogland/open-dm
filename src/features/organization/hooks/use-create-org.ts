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
    const [redemptionKey, setRedemptionKey] = useState<string | undefined>(undefined);

    // New fields
    const [category, setCategory] = useState("");
    const [businessType, setBusinessType] = useState("");

    const [loading, setLoading] = useState(false);
    const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

    useEffect(() => {
        setOrganisationName(user?.name ?? "");
    }, [user]);

    // Validation: Name + Handle Available + Category + BusinessType
    const isFormValid =
        organisationName.trim() !== "" &&
        handleStatus === HandleState.available &&
        category !== "" &&
        businessType !== "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (isFormValid) {
            try {
                const organizationId = await createOrganization({
                    name: organisationName,
                    handle: handle, // The cleaned handle (CreateOrgForm should ensure this is cleaned, or we trust logic)
                    category,
                    businessType,
                    redemptionKey, // Pass the key if we found one
                });

                if (!organizationId) {
                    toast.error("Failed to create organization");
                    return;
                }
                setSelectedOrganization(organizationId);
                router.replace("/dashboard");
                toast.success("Organization created successfully");
            } catch (error) {
                if ((error as Error).message.includes("Limit Reached")) {
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
        setHandle, // Note: This might receive raw or cleaned handle depending on usage
        handleStatus,
        setHandleStatus,
        redemptionKey,
        setRedemptionKey,
        category,
        setCategory,
        businessType,
        setBusinessType,
        loading,
        upgradeDialogOpen,
        setUpgradeDialogOpen,
        isFormValid,
        handleSubmit,
    };
}
