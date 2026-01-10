"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OrganisationAvatar from "@/components/organisation-avatar";
import { Loader2, Upload, Copy, Check } from "lucide-react";
import { OrganizationType } from "@/features/organization/providers/user-data-provider";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface OrgProfileFormProps {
    organization: OrganizationType | null;
    name: string;
    setName: (name: string) => void;
    isUploading: boolean;
    onUpdateName: (e: React.FormEvent) => void;
    onImageUpload: (file: File) => void;
}

export function OrgProfileForm({
    organization,
    name,
    setName,
    isUploading,
    onUpdateName,
    onImageUpload
}: OrgProfileFormProps) {
    const [copied, setCopied] = useState(false);

    if (!organization) return null;

    const handleCopyHandle = () => {
        navigator.clipboard.writeText(organization.handle);
        setCopied(true);
        toast.success("Handle copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 pb-8 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Organization Profile</CardTitle>
              <CardDescription>
                Manage your organization's public identity and branding.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div>
              <div className="shrink-0 relative group mx-auto sm:mx-0 my-auto">
                <OrganisationAvatar
                  organisation={organization}
                  className="h-24 w-24 border-2 border-border shadow-sm text-2xl"
                />

                <label
                  htmlFor="logo-upload"
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm",
                    isUploading && "opacity-100 cursor-not-allowed",
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5" />
                  )}
                  <span className="text-[9px] mt-1">
                    Edit
                  </span>
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onImageUpload(file);
                    }}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            <form onSubmit={onUpdateName} className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handle">Organization Handle</Label>
                <div className="relative">
                  <Input
                    id="handle"
                    value={organization.handle}
                    readOnly
                    className="bg-muted text-muted-foreground font-mono pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                    onClick={handleCopyHandle}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Unique identifier for your organization.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={!name || name === organization.name}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    );
}
