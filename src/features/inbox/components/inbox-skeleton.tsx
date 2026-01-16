import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export default function InboxSkeleton() {
    return (
        <TableRow className="border-b">
            <TableCell className="w-[120px] hidden md:table-cell">
                <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-8 w-32" />
            </TableCell>
            <TableCell className="text-right w-[60px]">
                <div className="flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </TableCell>
        </TableRow>
    );
}
