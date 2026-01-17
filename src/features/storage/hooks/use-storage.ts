import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { useUserAuth } from "@/features/auth/providers/user-auth-provider";
import { Id } from "@/convex/_generated/dataModel";

export interface Attachment {
    _id: Id<"attachments">;
    _creationTime: number;
    name: string;
    type: string;
    url: string | null;
    size: number;
    storageId: Id<"_storage">;
}

const ITEMS_PER_PAGE = 20;

export function useStorage() {
    const { user } = useUserAuth();
    const { selectedOrganization } = useUserData();
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const attachments = useQuery(api.attachment.getUserAttachments,
        user && user.email && selectedOrganization ? {
            userEmail: user.email,
            organization: selectedOrganization._id
        } : "skip"
    );

    const visibleAttachments = useMemo(() => {
        if (!attachments) return [];
        return attachments.slice(0, visibleCount);
    }, [attachments, visibleCount]);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    return {
        attachments,
        visibleAttachments,
        visibleCount: visibleAttachments.length,
        handleLoadMore,
        totalCount: attachments?.length ?? 0,
        isLoading: attachments === undefined,
        isEmpty: attachments !== undefined && attachments.length === 0,
        canLoadMore: attachments ? visibleCount < attachments.length : false,
    };
}
