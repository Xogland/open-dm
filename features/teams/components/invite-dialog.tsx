"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Copy,
  Share2,
  Check,
  AlertCircle,
  Lock,
  Sparkles,
  User,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Service } from "@/lib/types";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organisationId: Id<"organisations">;
  services: Service[];
  onCreateInvite: (args: {
    organisationId: Id<"organisations">;
    role: "editor" | "viewer";
  }) => Promise<{ inviteId: Id<"teamInvites">; token: string }>;
  plan?: string;
  isLimitReached?: boolean;
  limit?: number;
  currentCount?: number;
}

export function InviteDialog({
  open,
  onOpenChange,
  organisationId,
  onCreateInvite,
  isLimitReached = false,
  limit,
  currentCount,
}: InviteDialogProps) {
  const [role, setRole] = useState<"editor" | "viewer">("viewer");
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateInvite = async () => {
    setIsGenerating(true);
    try {
      const result = await onCreateInvite({
        organisationId,
        role,
      });
      setInviteToken(result.token);
      toast.success("Invite generated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate invite");
    } finally {
      setIsGenerating(false);
    }
  };

  const getInviteUrl = () => {
    if (typeof window === "undefined" || !inviteToken) return "";
    return `${window.location.origin}/invite/${inviteToken}`;
  };

  const handleCopy = async () => {
    const url = getInviteUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = getInviteUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Team Invite",
          text: "You've been invited to join our team!",
          url,
        });
      } catch (error) {
        /* cancel */
      }
    } else {
      handleCopy();
    }
  };

  const handleClose = () => {
    setRole("viewer");
    setInviteToken(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    // Increased max-width to 600px for a more balanced look
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-8">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl">Invite Team Member</DialogTitle>
          <DialogDescription className="text-base">
            {inviteToken
              ? "Your invite link is ready. Share it with your colleague."
              : "Grant access to your organization by selecting a role below."}
          </DialogDescription>
        </DialogHeader>

        {!inviteToken ? (
          <div className="space-y-6 py-6">
            {isLimitReached && <LimitReached limit={limit} currentCount={currentCount}/>}

            <div className="space-y-3">
              <Label htmlFor="role" className="text-sm font-medium ml-1">
                Member Role
              </Label>
              <Select value={role} onValueChange={(v: any) => setRole(v)}>
                <SelectTrigger id="role" className="w-full py-4 h-20 text-left">
                  <p className="text-sm font-bold">
                    {role === "editor" ? "Editor" : "Viewer"}
                  </p>
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectionItem
                    value={"editor"}
                    title={"Editor"}
                    description={
                      "Full access to view submissions and edit organization forms."
                    }
                  />
                  <SelectionItem
                    value={"Viewer"}
                    title={"Viewer"}
                    description={
                      "Read-only access to submissions. Cannot edit forms."
                    }
                  />
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium ml-1">Invite Link</Label>
              <div className="p-4 bg-muted border rounded-lg break-all text-sm font-mono flex items-center justify-between gap-4">
                <span className="truncate">{getInviteUrl()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                variant="secondary"
                className="flex-1 h-11"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Copy Link
                  </>
                )}
              </Button>
              <Button
                onClick={handleShare}
                variant="secondary"
                className="flex-1 h-11"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-end gap-3 pt-2">
          {!inviteToken ? (
            <>
              <Button variant="ghost" onClick={handleClose} className="px-6">
                Cancel
              </Button>
              <Button
                onClick={handleGenerateInvite}
                disabled={isGenerating || isLimitReached}
                className="px-8"
              >
                {isGenerating ? "Generating..." : "Generate Invite Link"}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="px-10">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const LimitReached = ({
  limit,
  currentCount,
}: {
  limit: number | undefined;
  currentCount: number | undefined;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in-95 duration-300">
      {/* 1. The Visual Seat Tracker */}
      {/* This creates a visual row of seats to show 'Fullness' without text */}
      <div className="flex items-center gap-1.5 mb-6">
        {Array.from({ length: Math.min(limit ?? 0, 5) }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground"
          >
            <User className="w-3.5 h-3.5" />
          </div>
        ))}
        {/* The Locked Seat */}
        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900 border border-dashed border-red-200 dark:border-red-700 flex items-center justify-center shadow-sm z-10">
          <Lock className="w-3.5 h-3.5 text-red-400" />
        </div>
      </div>

      <div className="text-center space-y-1.5 mb-6">
        <h3 className="text-sm font-semibold text-red-400 dark:text-red-700">
          Team capacity reached
        </h3>
        <p className="text-[13px] text-muted-foreground max-w-[260px] mx-auto leading-relaxed">
          You have filled all{" "}
          <span className="text-foreground font-medium">{limit} seats</span>{" "}
          included in your plan.
        </p>
      </div>
    </div>
  );
};

const SelectionItem = ({
  value,
  title,
  description,
}: {
  value: string;
  title: string;
  description: string;
}) => {
  return (
    <SelectItem value={value} className="p-3">
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </SelectItem>
  );
};
