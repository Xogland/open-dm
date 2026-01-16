"use client";

import { Search, Filter, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import SidePanel from "./side-panel";
import { PageHeader } from "@/components/page-header";
import { useInboxData } from "../hooks/use-inbox-data";
import { InboxTable } from "./inbox-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";

export default function InboxPage() {
    const {
        submissions,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedService,
        setSelectedService,
        uniqueServices,
        selectedSubmission,
        isPanelOpen,
        handleViewSubmission,
        closeSidePanel,
        organizationStatuses,
    } = useInboxData();

    return (
        <PageShell
            childrenWrapperClassName={isPanelOpen ? "lg:mr-[675px]" : "transition-all duration-300 ease-in-out"}
            sidebar={
                <>
                    <SidePanel
                        submission={selectedSubmission}
                        isPanelOpen={isPanelOpen}
                        closeSidePanel={closeSidePanel}
                        organisationStatuses={organizationStatuses}
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
            <PageHeader title="Inbox" description="Manage and respond to your form submissions.">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        onClick={() => window.location.reload()}
                        title="Refresh"
                    >
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>
            </PageHeader>

            {/* Filters and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-xl border shadow-sm shrink-0">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search submissions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-11 w-full bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0 hidden md:flex">
                        <Filter className="h-4 w-4" />
                        <span>Filter:</span>
                    </div>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="h-11 w-full sm:w-[200px] bg-muted/30 border-none">
                            <SelectValue placeholder="All Services" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Services</SelectItem>
                            {uniqueServices.map((service) => (
                                <SelectItem key={service} value={service}>
                                    {service}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-card rounded-xl border shadow-sm">
                <InboxTable
                    isLoading={isLoading}
                    submissions={submissions}
                    searchQuery={searchQuery}
                    selectedSubmissionId={selectedSubmission?._id}
                    onViewSubmission={handleViewSubmission}
                    organisationStatuses={organizationStatuses}
                />
            </div>
        </PageShell>
    );
}
