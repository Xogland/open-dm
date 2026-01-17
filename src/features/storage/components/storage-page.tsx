"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useStorage } from "../hooks/use-storage";
import { FileGrid, FileGridSkeleton } from "./file-grid";
import { StorageEmptyState } from "./storage-empty-state";
import { PageShell } from "@/components/page-shell";

export default function StoragePage() {
    const {
        visibleAttachments,
        isLoading,
        isEmpty,
        canLoadMore,
        handleLoadMore,
        totalCount,
        visibleCount
    } = useStorage();

    return (
        <PageShell>
            {/* Header */}
            <PageHeader
                title="Storage"
                description="Access and manage all files and attachments submitted through your forms."
            />

            {isLoading ? (
                <div className="flex-1">
                    <FileGridSkeleton />
                </div>
            ) : isEmpty ? (
                <div className="flex-1 flex items-center justify-center">
                    <StorageEmptyState />
                </div>
            ) : (
                <div className="space-y-8 pb-12 flex-1 flex flex-col min-h-0">


                    <div className="flex-1">
                        <FileGrid attachments={visibleAttachments} />
                    </div>

                    {canLoadMore && (
                        <div className="flex justify-center pt-8">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleLoadMore}
                                className="rounded-xl px-8 shadow-sm"
                            >
                                Load More ({totalCount - visibleCount} remaining)
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </PageShell>
    );
}
