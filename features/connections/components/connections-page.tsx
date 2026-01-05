"use client";

import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import SidePanel from "@/features/inbox/components/side-panel";
import { format } from "date-fns";
import { useConnectionsData, ConnectionData } from "../hooks/use-connections-data";
import { ConnectionsTable } from "./connections-table";
import { PageShell } from "@/components/page-shell";

// --- CSV Download Utility Function ---
const downloadCSV = (data: ConnectionData[]) => {
    if (!data || data.length === 0) return;

    // 1. Define CSV Headers
    const headers = ["Email", "Submission Count", "Created On"];

    // 2. Map data to CSV rows
    const csvRows = data.map((connection) => [
        `"${connection.email.replace(/"/g, '""')}"`, // Handle quotes in email
        connection.submissionCount ?? 0,
        format(new Date(connection._creationTime), "yyyy-MM-dd HH:mm:ss"), // ISO format for export
    ]);

    // 3. Combine headers and rows
    const csvContent = [
        headers.join(","),
        ...csvRows.map((row) => row.join(",")),
    ].join("\n");

    // 4. Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
        "download",
        `client-management-export-${format(new Date(), "yyyyMMdd_HHmm")}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default function ConnectionsPage() {
    const {
        connections,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedSubmission,
        selectedSubmissionId,
        isPanelOpen,
        handleViewConnection,
        closeSidePanel,
    } = useConnectionsData();

    const handleDownload = () => {
        if (connections) {
            downloadCSV(connections);
        }
    };

    return (
        <PageShell
            childrenWrapperClassName={isPanelOpen ? "lg:mr-[675px]" : "transition-all duration-300 ease-in-out"}
            sidebar={
                <>
                    <SidePanel
                        submission={selectedSubmission as any}
                        isPanelOpen={isPanelOpen}
                        closeSidePanel={closeSidePanel}
                    />
                    {isPanelOpen && (
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] transition-opacity duration-300 lg:hidden"
                            onClick={closeSidePanel}
                            aria-hidden="true"
                        />
                    )}
                </>
            }
        >
            {/* Header */}
            <PageHeader
                title="Client Management"
                description="View and export all unique contacts who have reached out to you."
            >
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleDownload}
                        disabled={!connections || connections.length === 0}
                        className="h-10 text-sm font-semibold shadow-lg shadow-primary/10 rounded-xl"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Download CSV</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                </div>
            </PageHeader>

            {/* Filters and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-xl border shadow-sm shrink-0">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 w-full bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
                    <span className="font-bold text-foreground">
                        {connections?.length || 0}
                    </span>
                    Clients found
                </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-card rounded-xl border shadow-sm">
                <ConnectionsTable
                    isLoading={isLoading}
                    connections={connections}
                    searchQuery={searchQuery}
                    selectedSubmissionId={selectedSubmissionId}
                    onViewConnection={handleViewConnection}
                />
            </div>
        </PageShell>
    );
}
