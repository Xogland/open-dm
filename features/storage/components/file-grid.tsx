"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { FilePreview } from "@/components/file-preview";
import { Attachment } from "../hooks/use-storage";

interface FileGridProps {
    attachments: Attachment[];
}

export function FileGrid({ attachments }: FileGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {attachments.map((attachment) => (
                <Card key={attachment._id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <CardContent className="p-0 flex-grow min-h-[160px] h-[160px]">
                        <FilePreview
                            name={attachment.name}
                            type={attachment.type}
                            url={attachment.url}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-3 gap-2 border-t bg-card">
                        <div className="w-full">
                            <p className="font-medium truncate text-sm" title={attachment.name}>
                                {attachment.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(attachment._creationTime), "MMM dd, yyyy")} • {(attachment.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-1 h-8 text-xs" asChild>
                            <a href={attachment.url || `/api/storage/${attachment.storageId}`} target="_blank" rel="noopener noreferrer" download={attachment.name}>
                                <Download className="h-3 w-3 mr-2" />
                                Download
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export function FileGridSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading storage...</p>
        </div>
    );
}
