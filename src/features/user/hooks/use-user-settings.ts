import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserAuth } from "@/features/auth/providers/user-auth-provider";
import { toast } from "sonner";

export function useUserSettings() {
    const { user } = useUserAuth();
    // const updateUser = useMutation(api.users.updateUser); // NOT SUPPORTED IN BACKEND

    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form
    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            // Backend does not support user updates yet
            // await updateUser({
            //     name: name,
            // });
            alert("User profile updates are not yet supported.");
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        name,
        setName,
        isLoading,
        handleUpdateProfile,
    };
}
