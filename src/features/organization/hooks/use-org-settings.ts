import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { useUserAuth } from "@/features/auth/providers/user-auth-provider";
import { toast } from "sonner";


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

    const handleUpdateStatuses = async (statuses: { id: string; label: string; color: string; isDefault: boolean }[]) => {
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

    const generateUploadUrl = useMutation(api.attachment.generateUploadUrl);
    const updateOrganisationImage = useMutation(api.organisation.updateOrganisationImage);

    const handleImageUpload = async (file: File) => {
        if (!selectedOrganization) return;
        setIsUploading(true);
        try {
            // 1. Get upload URL
            const postUrl = await generateUploadUrl();

            // 2. Upload file
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });

            if (!result.ok) throw new Error("Upload failed");

            const { storageId } = await result.json();

            // 3. Update organization
            await updateOrganisationImage({
                organisationId: selectedOrganization._id,
                storageId: storageId,
            });

            toast.success("Image updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update image");
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
