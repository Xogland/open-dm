"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Mail,
} from "lucide-react";
import { IoIosContact } from "react-icons/io";
import ConnectionSkeleton from "./connection-skeleton";
import { ConnectionData } from "../hooks/use-connections-data";

interface ConnectionsTableProps {
    isLoading: boolean;
    connections: ConnectionData[] | undefined;
    searchQuery: string;
    selectedSubmissionId: string | null;
    onViewConnection: (connection: ConnectionData) => void;
}



export function ConnectionsTable({
    isLoading,
    connections,
    searchQuery,
    selectedSubmissionId,
    onViewConnection,
}: ConnectionsTableProps) {
    if (isLoading) {
        return (
            <div className="overflow-x-auto border rounded-lg shadow-sm bg-card">
                <Table>
                    <TableHeader className="bg-muted/50 border-b">
                        <TableRow className="hover:bg-muted/50">
                            <TableHead className="w-[20%] min-w-[200px] text-foreground py-4">
                                Email
                            </TableHead>
                            <TableHead className="w-[15%] text-center text-foreground py-4">
                                Submissions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <ConnectionSkeleton key={index} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (!connections || connections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center border rounded-lg shadow-sm min-h-[40vh] bg-card">
                <Mail className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-xl text-foreground">
                    {searchQuery
                        ? "No matching clients found."
                        : "No clients found yet."}
                </p>
                <p className="text-base text-muted-foreground max-w-sm">
                    Clients represent unique email threads or lead sources from your
                    forms. They will appear here when a submission is first received.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border rounded-lg shadow-sm bg-card">
            <Table>
                <TableHeader className="bg-muted/50 border-b">
                    <TableRow className="hover:bg-muted/50">
                        <TableHead className="w-[20%] min-w-[200px] text-foreground py-4">
                            Email
                        </TableHead>
                        <TableHead className="w-[15%] text-center text-foreground py-4">
                            Submissions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {connections.map((connection) => (
                        <TableRow
                            key={connection._id}
                            className={`hover:bg-accent/50 transition-colors cursor-pointer border-b ${selectedSubmissionId === connection.lastSubmission ? "bg-accent/70" : ""}`}
                            onClick={() => onViewConnection(connection)}
                        >
                            <TableCell className="font-semibold flex items-center gap-2 px-4 py-3 whitespace-nowrap">
                                <IoIosContact className="h-4 w-4 text-foreground" />{" "}
                                {connection.email.length === 0 ? "Unknown" : connection.email}
                            </TableCell>
                            <TableCell className="text-center text-base text-foreground">
                                {connection.submissionCount ?? 0}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
