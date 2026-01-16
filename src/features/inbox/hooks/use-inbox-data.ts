import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { useUserAuth } from "@/features/auth/providers/user-auth-provider";
import { Id } from "@/convex/_generated/dataModel";

export interface SubmissionData {
    formName: string | undefined;
    _id: Id<"submissions">;
    _creationTime: number;
    service?: string;
    workflowAnswers?: any;
    cc?: string[] | undefined;
    content?: string | undefined;
    email: string;
    timeToSubmit?: number | undefined;
    score?: number | undefined;
    statusId?: string;
}

export function useInboxData() {
    const { user } = useUserAuth();
    const { selectedOrganization } = useUserData();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedService, setSelectedService] = useState<string>("all");
    const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Fetch submissions
    const submissions = useQuery(api.submission.getSubmissions, {
        organisation: selectedOrganization?._id,
        userEmail: user?.email ?? "",
    });

    // Get unique services for filter
    const uniqueServices = useMemo(() => {
        if (!submissions) return [];
        const services = new Set<string>();
        submissions.forEach(s => {
            if (s.service) services.add(s.service);
        });
        return Array.from(services).sort();
    }, [submissions]);

    // Filter logic
    const filteredSubmissions = useMemo(() => {
        if (!submissions) return undefined;

        let filtered = submissions;

        // Apply service filter
        if (selectedService !== "all") {
            filtered = filtered.filter(s => s.service === selectedService);
        }

        // Apply search query
        const lowerCaseQuery = searchQuery.toLowerCase().trim();
        if (lowerCaseQuery) {
            filtered = filtered.filter((submission) =>
                (submission.formName ?? "").toLowerCase().includes(lowerCaseQuery) ||
                (submission.email ?? "").toLowerCase().includes(lowerCaseQuery) ||
                (submission.service ?? "").toLowerCase().includes(lowerCaseQuery) ||
                (submission.content ?? "").toLowerCase().includes(lowerCaseQuery)
            );
        }

        return filtered;
    }, [submissions, searchQuery, selectedService]);

    // Actions
    const handleViewSubmission = (submission: SubmissionData) => {
        setSelectedSubmission(submission);
        setIsPanelOpen(true);
    };

    const closeSidePanel = () => {
        setIsPanelOpen(false);
        setTimeout(() => setSelectedSubmission(null), 300);
    };

    return {
        submissions: filteredSubmissions,
        isLoading: submissions === undefined,
        searchQuery,
        setSearchQuery,
        selectedService,
        setSelectedService,
        uniqueServices,
        selectedSubmission,
        isPanelOpen,
        handleViewSubmission,
        closeSidePanel,
        organizationStatuses: selectedOrganization?.statuses,
    };
}
