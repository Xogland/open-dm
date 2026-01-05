import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export default function ConnectionSkeleton() {
    return (
        <TableRow className="border-b">
            <TableCell className="w-[20%] min-w-[200px]">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                </div>
            </TableCell>
            <TableCell className="w-[30%] min-w-[250px]">
                <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell className="w-[15%] text-center">
                <div className="flex justify-center">
                    <Skeleton className="h-6 w-8" />
                </div>
            </TableCell>
        </TableRow>
    );
}
