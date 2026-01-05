import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search, Inbox, Clock, Mail } from "lucide-react";
import { format } from "date-fns";
import InboxSkeleton from "./inbox-skeleton";
import { SubmissionData } from "../hooks/use-inbox-data";
import { Status } from "@/features/organization/providers/user-data-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface InboxTableProps {
    isLoading: boolean;
    submissions: SubmissionData[] | undefined;
    searchQuery: string;
    selectedSubmissionId?: string;
    onViewSubmission: (submission: SubmissionData) => void;
    organisationStatuses: Status[] | undefined;
}

export function InboxTable({
    isLoading,
    submissions,
    searchQuery,
    selectedSubmissionId,
    onViewSubmission,
    organisationStatuses
}: InboxTableProps) {
    const updateStatus = useMutation(api.submission.updateSubmissionStatus);

    const handleStatusChange = async (submissionId: any, statusId: string) => {
        try {
            await updateStatus({ id: submissionId, statusId });
            toast.success("Status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="w-[140px] hidden md:table-cell">Time</TableHead>
                            <TableHead className="hidden lg:table-cell">Form</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 8 }).map((_, index) => (
                            <InboxSkeleton key={index} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (!submissions || submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-card rounded-xl border border-dashed border-muted-foreground/20 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-muted/50 rounded-full">
                    <Inbox className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-foreground">
                        {searchQuery ? "No matching submissions" : "Inbox is empty"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[300px] mx-auto">
                        {searchQuery
                            ? "We couldn't find any submissions matching your search criteria."
                            : "New submissions will appear here as soon as they are received."}
                    </p>
                </div>
                {searchQuery && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.reload()}
                        className="mt-2"
                    >
                        Clear all filters
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="overflow-auto flex-1">
                <Table>
                    <TableHeader className="bg-muted/30 sticky top-0 z-10">
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="w-[140px] font-semibold text-foreground whitespace-nowrap hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    Time
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-foreground whitespace-nowrap hidden lg:table-cell">
                                Form
                            </TableHead>
                            <TableHead className="font-semibold text-foreground whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                    Submission
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-foreground whitespace-nowrap">
                                Status
                            </TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.map((submission) => (
                            <TableRow
                                key={submission._id}
                                className={`hover:bg-accent/40 transition-colors cursor-pointer group ${selectedSubmissionId === submission._id ? "bg-accent/60" : ""}`}
                                onClick={() => onViewSubmission(submission)}
                            >
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap hidden md:table-cell">
                                    {format(new Date(submission._creationTime), "MMM dd, hh:mm a")}
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap hidden lg:table-cell text-xs opacity-70">
                                    {submission.formName}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate text-sm">
                                                {submission.email || "Anonymous"}
                                            </span>
                                            <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 font-normal bg-primary/5 text-primary hover:bg-primary/10 border-none shrink-0 capitalize">
                                                {submission.service || "General"}
                                            </Badge>
                                        </div>
                                        <div className="flex md:hidden items-center gap-2 mt-1 text-[10px] text-muted-foreground/60">
                                            <span>{format(new Date(submission._creationTime), "MMM dd")}</span>
                                            <span>•</span>
                                            <span>{submission.formName}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <Select
                                            value={submission.statusId || ""}
                                            onValueChange={(value) => handleStatusChange(submission._id, value)}
                                        >
                                            <SelectTrigger className="h-8 min-w-[100px] max-w-[160px] text-xs bg-muted/30 border-none shadow-none focus:ring-0">
                                                <SelectValue>
                                                    {submission.statusId && organisationStatuses?.find(s => s.id === submission.statusId) ? (
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-2 h-2 rounded-full shrink-0"
                                                                style={{ backgroundColor: organisationStatuses.find(s => s.id === submission.statusId)?.color }}
                                                            />
                                                            <span className="truncate">
                                                                {organisationStatuses.find(s => s.id === submission.statusId)?.label}
                                                            </span>
                                                        </div>
                                                    ) : <span className="text-muted-foreground">No status</span>}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent align="end" className="w-[180px]">
                                                {organisationStatuses?.map((status) => (
                                                    <SelectItem key={status.id} value={status.id} className="text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: status.color }}
                                                            />
                                                            {status.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                                {(!organisationStatuses || organisationStatuses.length === 0) && (
                                                    <div className="p-2 text-xs text-muted-foreground text-center">
                                                        No statuses defined
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors shrink-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewSubmission(submission);
                                        }}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
