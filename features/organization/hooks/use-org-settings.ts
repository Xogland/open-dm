import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { useUserAuth } from "@/features/auth/providers/user-auth-provider";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export function useOrgSettings() {
    const { user } = useUserAuth();
    const { selectedOrganization } = useUserData();
    const updateOrg = useMutation(api.organisation.updateOrganisationName);
    const updateStatuses = useMutation(api.organisation.updateOrganisationStatuses);

    const [name, setName] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Initialize form with current data
    useEffect(() => {
        if (selectedOrganization) {
            setName(selectedOrganization.name);
        }
    }, [selectedOrganization]);

    // Actions
    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrganization) return;

        try {
            await updateOrg({
                organisationId: selectedOrganization._id,
                name: name,
            });
            toast.success("Organization name updated");
        } catch (error) {
            toast.error("Failed to update name");
            console.error(error);
        }
    };

    const handleUpdateStatuses = async (statuses: any[]) => {
        if (!selectedOrganization) return;

        try {
            await updateStatuses({
                organisationId: selectedOrganization._id,
                statuses: statuses,
            });
            toast.success("Statuses updated");
        } catch (error) {
            toast.error("Failed to update statuses");
            console.error(error);
        }
    };

    const handleImageUpload = async (file: File) => {
        // Assuming file upload logic involving generation of upload URL
        // This is a placeholder for the actual upload logic integration
        setIsUploading(true);
        try {
            // ... upload logic ...
            toast.info("Image upload coming soon (Logic to be integrated)");
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    return {
        organization: selectedOrganization,
        name,
        setName,
        isUploading,
        handleUpdateName,
        handleUpdateStatuses,
        handleImageUpload,
        isLoading: !selectedOrganization,
    };
}
