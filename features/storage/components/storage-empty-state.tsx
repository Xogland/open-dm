"use client";

import { FileIcon } from "lucide-react";

export function StorageEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center border rounded-lg shadow-sm min-h-[40vh] bg-card">
            <div className="p-4 bg-primary/10 rounded-full">
                <FileIcon className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xl font-semibold text-foreground">
                No files found
            </p>
            <p className="text-base text-muted-foreground max-w-sm">
                Attachments from your form submissions will appear here.
            </p>
        </div>
    );
}
