"use client";
import * as React from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Mail, Clock, User, Calendar, PhoneIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileIcon, Download } from "lucide-react";
import { Status } from "@/features/organization/providers/user-data-provider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { toast } from "sonner";

// Define the expected submission data structure
interface SubmissionData {
  formName: string | undefined;
  _id: Id<"submissions">;
  _creationTime: number;
  service?: string;
  workflowAnswers?: Record<string, unknown>;
  cc?: string[] | undefined;
  content?: string | undefined;
  email: string;
  timeToSubmit?: number | undefined;
  score?: number | undefined;
  statusId?: string;
}

// Define the required props for the side panel
interface SidePanelProps {
  submission: SubmissionData | null;
  isPanelOpen: boolean;
  closeSidePanel: () => void;
  organisationStatuses?: Status[];
}

// Utility to format time to submit
/*
const formatTimeToSubmit = (ms: number | undefined): string => {
...
};
*/

// Render workflow answers as structured data
const renderWorkflowAnswers = (workflowAnswers: Record<string, unknown>) => {
  if (!workflowAnswers || typeof workflowAnswers !== "object") {
    return null;
  }

  // Filter out service and iterate over values which now contain { answer, question, type }
  const answersList = Object.entries(workflowAnswers)
    .filter(([key]) => key !== "service")
    .map(([_key, value]) => value as { answer: any; question: string; type: string; })
    .filter(item => item && item.question); // Basic validation

  if (answersList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {answersList.map((item, index) => {
        const { answer, question, type } = item;

        let content: React.ReactNode;

        switch (type) {
          case 'file':
          case 'file_upload':
            if (answer && typeof answer === 'object' && answer.type === 'file_reference') {
              content = (
                <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-md">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <FileIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm truncate max-w-[150px]">{answer.name}</span>
                    <span className="text-xs text-muted-foreground">{(answer.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              );
            } else {
              content = <span className="text-muted-foreground italic">No file uploaded</span>;
            }
            break;

          case 'date':
          case 'date_input':
            try {
              content = (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{format(new Date(answer), "PPP")}</span>
                </div>
              );
            } catch (e) {
              content = String(answer);
            }
            break;

          case 'email':
          case 'email_input':
            content = (
              <div className="flex items-center gap-2 text-blue-600 hover:underline">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${answer}`}>{answer}</a>
              </div>
            );
            break;

          case 'phone':
          case 'phone_input':
            content = (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-primary" />
                <a href={`tel:${answer}`} className="hover:underline">{answer}</a>
              </div>
            );
            break;

          case 'multiple_choice':
            if (Array.isArray(answer)) {
              content = (
                <div className="flex flex-col gap-1.5">
                  {answer.map((opt: string | { title: string; price?: string }, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-muted/30 p-1.5 rounded">
                      <span className="font-medium">{typeof opt === 'string' ? opt : opt.title}</span>
                      {typeof opt === 'object' && opt.price && <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">{opt.price}</span>}
                    </div>
                  ))}
                </div>
              );
            } else {
              const opt = answer;
              content = (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{typeof opt === 'string' ? opt : opt.title}</span>
                  {typeof opt === 'object' && opt.price && <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">{opt.price}</span>}
                </div>
              );
            }
            break;

          default:
            if (typeof answer === 'object') {
              content = <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">{JSON.stringify(answer, null, 2)}</pre>;
            } else {
              content = String(answer);
            }
        }

        return (
          <Card key={index} className="overflow-hidden border-none shadow-md bg-card transition-colors">
            <div className="flex flex-col">
              <div className="px-4 py-3 bg-secondary/30 border-b border-border/50 flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                  {index + 1}
                </div>
                <span className="text-sm text-foreground/90">{question}</span>
              </div>
              <div className="p-4">
                <div className="text-sm text-foreground">
                  {content}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default function SidePanel({
  submission,
  isPanelOpen,
  closeSidePanel,
  organisationStatuses,
}: SidePanelProps) {
  const selectedSubmission = submission;
  const selectedLeadEmail = selectedSubmission?.email;
  const ccEmails =
    selectedSubmission?.cc && selectedSubmission.cc.length > 0
      ? selectedSubmission.cc.join(",")
      : "";
  const mailtoLink = selectedLeadEmail
    ? `mailto:${selectedLeadEmail}?subject=Re: Inquiry${selectedSubmission?.formName ? ` from ${selectedSubmission.formName}` : ""}${ccEmails ? `&cc=${ccEmails}` : ""}`
    : "#";

  const attachments = useQuery(
    api.attachment.getAttachmentsBySubmission,
    selectedSubmission ? { submissionId: selectedSubmission._id } : "skip"
  );

  const updateStatus = useMutation(api.submission.updateSubmissionStatus);

  const handleStatusChange = async (statusId: string) => {
    if (!selectedSubmission) return;
    try {
      await updateStatus({ id: selectedSubmission._id, statusId });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-[675px] bg-background border-l border-border shadow-2xl z-[50] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="h-full flex flex-col">
        {/* Panel Header */}
        <div className="flex flex-col p-6 sm:p-8 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <Typography variant="subheading" as="h2">
                {selectedSubmission?.formName || "Details"}
              </Typography>
              {selectedSubmission && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px]">
                    {selectedSubmission.service || "General"}
                  </Badge>
                  {organisationStatuses && (
                    <Select
                      value={selectedSubmission.statusId || ""}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="h-6 w-auto min-w-[100px] border-none bg-accent/30 hover:bg-accent/50 transition-colors px-2 rounded-md text-[10px] focus:ring-0">
                        <div className="flex items-center gap-1.5">
                          {selectedSubmission?.statusId && organisationStatuses?.find(s => s.id === selectedSubmission.statusId) ? (
                            <>
                              <div
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: organisationStatuses.find(s => s.id === selectedSubmission.statusId)?.color || '#6B7280' }}
                              />
                              <span className="font-semibold text-foreground/80">
                                {organisationStatuses.find(s => s.id === selectedSubmission.statusId)?.label}
                              </span>
                            </>
                          ) : <span className="text-muted-foreground">Set Status</span>}
                        </div>
                      </SelectTrigger>
                      <SelectContent align="start" className="min-w-[140px]">
                        {organisationStatuses.map((status) => (
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
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSidePanel}
              className="flex-shrink-0 text-muted-foreground hover:bg-accent hover:text-foreground rounded-full h-10 w-10 transition-all hover:rotate-90"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="lg"
              disabled={!selectedLeadEmail}
              onClick={() => {
                if (selectedLeadEmail) {
                  window.location.href = mailtoLink;
                }
              }}
              className="flex-1 shadow-lg shadow-primary/20 h-12 rounded-xl group"
            >
              <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Reply to Lead
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border/50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Panel Content */}
        <ScrollArea className="flex-1 min-h-0">
          {selectedSubmission ? (
            <div className="p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">

              {/* Metadata Section */}
              <div className="grid gap-4">
                <div className="flex flex-col gap-1.5 p-4 rounded-xl border bg-muted/20 border-border/50">
                  <Typography variant="caption" className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Sender
                  </Typography>
                  <div className="font-medium text-foreground pl-5 truncate">
                    {selectedSubmission.email}
                  </div>
                </div>



                <div className="flex flex-col gap-1.5 p-4 rounded-xl border bg-muted/20 border-border/50">
                  <Typography variant="caption" className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Received
                  </Typography>
                  <div className="font-medium text-foreground pl-5">
                    {format(new Date(selectedSubmission._creationTime), "MMMM dd, yyyy 'at' hh:mm a")}
                  </div>
                </div>
              </div>

              {/* Workflow Answers */}
              {selectedSubmission.workflowAnswers && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border/50" />
                    <Typography variant="subheading" className="text-xs flex items-center shrink-0">
                      Form Responses
                    </Typography>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  {renderWorkflowAnswers(selectedSubmission.workflowAnswers)}
                </div>
              )}

              {/* Legacy/Message Content */}
              {selectedSubmission.content && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border/50" />
                    <Typography variant="subheading" className="text-xs shrink-0">
                      Message Content
                    </Typography>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <div className="p-5 rounded-2xl bg-muted/30 border border-border/40 text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
                    {selectedSubmission.content}
                  </div>
                </div>
              )}

              {/* Attachments Section */}
              {attachments && attachments.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border/50" />
                    <Typography variant="subheading" className="text-xs shrink-0">
                      Attachments ({attachments.length})
                    </Typography>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <div className="grid gap-3">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment._id}
                        className="flex items-center justify-between p-4 bg-background rounded-xl border border-border/60 hover:border-primary/30 transition-all hover:shadow-sm group"
                      >
                        <div className="flex items-center overflow-hidden gap-4">
                          <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                            <FileIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm truncate">
                              {attachment.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {(attachment.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                          <a
                            href={`/api/storage/${attachment.storageId}?name=${encodeURIComponent(attachment.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
              <div className="p-6 bg-muted/30 rounded-full animate-pulse">
                <Mail className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-1">
                <Typography variant="subheading" className="font-bold">No submission selected</Typography>
                <Typography variant="body" className="text-sm text-center max-w-[200px]">
                  Select a submission from the inbox to view the full details here.
                </Typography>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}