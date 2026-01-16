import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { Id } from "@/convex/_generated/dataModel";

export interface ConnectionData {
    _id: Id<"connections">;
    _creationTime: number;
    organisation: Id<"organisations">;
    email: string;
    subject?: string;
    submissionCount?: number;
    lastSubmission?: Id<"submissions">;
    status: "active" | "pending" | "blocked" | string;
}

export function useConnectionsData() {
    const { selectedOrganization } = useUserData();
    const [searchQuery, setSearchQuery] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<Id<"submissions"> | null>(null);

    // Fetch connections
    const connections = useQuery(api.connection.getConnections, selectedOrganization ? {
        organisationId: selectedOrganization._id,
    } : "skip");

    // Fetch selected submission details
    const selectedSubmission = useQuery(
        api.submission.getSubmission,
        selectedSubmissionId ? { id: selectedSubmissionId } : "skip",
    );

    // Filter logic
    const filteredConnections = useMemo(() => {
        if (!connections) return undefined;
        const lowerCaseQuery = searchQuery.toLowerCase().trim();
        if (!lowerCaseQuery) return connections;

        return (connections as ConnectionData[]).filter((connection) =>
            (connection.email ?? "").toLowerCase().includes(lowerCaseQuery)
        );
    }, [connections, searchQuery]);

    // Actions
    const handleViewConnection = (connection: ConnectionData) => {
        if (connection.lastSubmission) {
            setSelectedSubmissionId(connection.lastSubmission);
            setIsPanelOpen(true);
        }
    };

    const closeSidePanel = () => {
        setIsPanelOpen(false);
        setTimeout(() => setSelectedSubmissionId(null), 300);
    };

    return {
        connections: filteredConnections,
        isLoading: connections === undefined,
        searchQuery,
        setSearchQuery,
        selectedSubmission,
        selectedSubmissionId,
        isPanelOpen,
        handleViewConnection,
        closeSidePanel,
    };
}
