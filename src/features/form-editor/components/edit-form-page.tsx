"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  Link2Icon,
  PencilIcon,
  SaveIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import ContentSection, { FormContentData } from "./content-section";
import ChatFlowEditor from "./chat-flow-editor";
import WorkFlowEditor from "./work-flow-editor";
import { WorkflowData } from "@/lib/types";

import { useUserData } from "@/features/organization/providers/user-data-provider";
import { useTeamAccess } from "@/features/teams/hooks/use-team-access";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Unified Data Structure
interface UnifiedFormData {
  content: FormContentData;
  workflows: WorkflowData;
}

export default function EditFormPage() {
  const { selectedOrganization } = useUserData();

  const formData = useQuery(
    api.form.getFormByOrganisationId,
    selectedOrganization
      ? { organisationId: selectedOrganization._id }
      : "skip",
  );
  const { role: currentUserRole } = useTeamAccess(selectedOrganization?._id);
  const updateForm = useMutation(api.form.update);

  const isViewer = currentUserRole === "viewer";
  const [activeTab, setActiveTab] = useState<
    "content" | "chat-flow" | "work-flow"
  >("content");
  const [data, setData] = useState<UnifiedFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (formData) {
      setData({
        content: {
          title: formData.properties?.title || "",
          description: formData.properties?.description || "",
          contactType: formData.properties?.contactInfo?.type || "email",
          phone: formData.properties?.contactInfo?.phone || "",
          profile: (formData.properties?.contactInfo as { profile?: string })?.profile || "",
          website: formData.properties?.contactInfo?.website || "",
          calendarLink: formData.properties?.contactInfo?.calendarLink || "",
          socialLinks: formData.properties?.socialLinks || {},
          tags: (formData.properties as { tags?: string[] })?.tags || [],
          services: formData.services || [],
        },
        workflows: formData.workflows || {},
      });
    }
  }, [formData]);

  const handleSave = async () => {
    if (!data || !formData) return;
    setIsSaving(true);
    try {
      // Transform content data to match new schema structure
      const properties = {
        title: data.content.title,
        description: data.content.description,
        contactInfo: {
          type: data.content.contactType,
          profile: data.content.profile,
          phone: data.content.phone,
          website: data.content.website,
          calendarLink: data.content.calendarLink,
        },
        tags: data.content.tags,
        socialLinks: data.content.socialLinks,
      };

      // Transform services to match new schema (string IDs)
      const services = data.content.services.map((service) => ({
        id: service.id.toString(),
        title: service.title,
      }));

      // Check if any workflow uses payment
      const hasPaymentStep = Object.values(data.workflows).some(steps =>
        steps.some(step => step.stepType === 'payment')
      );

      if (hasPaymentStep) {
        const org = selectedOrganization;
        const isStripeConfigured = !!org.stripeConfig?.publishableKey;

        if (!isStripeConfigured) {
          toast.error("Stripe is not configured. Please add your Stripe keys in Settings to use payment steps.");
          setIsSaving(false);
          return;
        }
      }

      await updateForm({
        id: formData._id,
        name: formData.name,
        properties,
        services,
        workflows: data.workflows,
      });
      toast.success("Form saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save form");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (newContent: FormContentData) => {
    setData((prev) => (prev ? { ...prev, content: newContent } : null));
  };

  const handleWorkflowChange = (newWorkflows: WorkflowData) => {
    setData((prev) => (prev ? { ...prev, workflows: newWorkflows } : null));
  };

  const handleServiceDelete = (serviceTitle: string) => {
    if (data && data.workflows && data.workflows[serviceTitle]) {
      const newWorkflows = { ...data.workflows };
      delete newWorkflows[serviceTitle];
      handleWorkflowChange(newWorkflows);
      toast.info(`Workflow for "${serviceTitle}" deleted.`);
    }
  };

  // Derive services list for the ChatFlowEditor from Content
  const servicesList =
    data?.content.services.map((s) => ({ title: s.title })) || [];

  if (!selectedOrganization || formData === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (formData === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>No form found for this organization.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full relative bg-background/50 overflow-hidden",
      )}
    >
      <div className={cn("flex-1 flex flex-col h-full overflow-hidden")}>
        <div
          className={cn(
            "h-full flex flex-col min-h-0 overflow-auto",
          )}
        >
          {/* Premium Header */}
          <div className="flex flex-col sm:flex-row w-full items-center justify-between p-4 md:px-8 bg-background/80 backdrop-blur-xl border-b border-border/50 z-10 shrink-0 gap-4">
            <div className="flex-none flex items-center gap-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <div className="flex items-center gap-2">
                      <Image src="/opendm.png" alt="OpenDM" width={24} height={24} className="object-contain" />
                      <div className="flex flex-col gap-0.5 hidden lg:inline select-none">
                        <span className="text-lg font-bold tracking-tight text-foreground">OpenDM</span>
                      </div>
                    </div>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-xs"
                    >
                      <HomeIcon className="h-3.5 w-3.5" />{" "}
                      <span className="hidden lg:inline">Dashboard</span>
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-muted-foreground/30" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="flex items-center gap-2 text-foreground text-xs">
                      <PencilIcon className="h-3.5 w-3.5 text-primary" />{" "}
                      <span>Profile Editor</span>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Centered Tabs */}
            <div className="flex-1 flex justify-center">
              <div className="flex bg-muted/40 rounded-xl p-1 shadow-sm border border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("content")}
                  className={`rounded-lg text-xs px-6 h-8 transition-all duration-200 ${activeTab === "content" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
                >
                  Profile & Content
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("chat-flow")}
                  className={`rounded-lg text-xs px-6 h-8 transition-all duration-200 ${activeTab === "chat-flow" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
                >
                  Chat Flow
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("work-flow")}
                  className={`rounded-lg text-xs px-6 h-8 transition-all duration-200 ${activeTab === "work-flow" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`}
                >
                  Workflow
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex-none flex items-center gap-3">
              {isViewer && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border text-[10px] text-muted-foreground">
                  <Link2Icon className="h-3 w-3" />
                  View Only
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-10 px-4 rounded-xl border-border/60 hover:bg-muted shadow-sm transition-all"
              >
                <Link href={`/${selectedOrganization.handle}`} target="_blank">
                  <Link2Icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Preview</span>
                </Link>
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving || isViewer}
                size="sm"
                className="h-10 px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <SaveIcon className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full overflow-hidden">
            {activeTab === "content" ? (
              <ContentSection
                data={data.content}
                onChange={handleContentChange}
                onServiceDelete={handleServiceDelete}
                orgHandle={selectedOrganization?.handle || ""}
                orgName={selectedOrganization?.name || ""}
                orgImage={selectedOrganization?.image}
                organisationId={selectedOrganization?._id}
                readOnly={isViewer}
                plan={selectedOrganization?.plan}
              />
            ) : activeTab === "chat-flow" ? (
              <ChatFlowEditor
                services={servicesList}
                workflows={data.workflows}
                onWorkflowsChange={handleWorkflowChange}
                readOnly={isViewer}
                plan={selectedOrganization?.plan}
                organisationId={selectedOrganization?._id}
              />
            ) : (
              <WorkFlowEditor
                organisationId={selectedOrganization._id}
                services={servicesList.map((s, idx) => ({
                  id: (data.content.services[idx]?.id || idx).toString(),
                  title: s.title,
                }))}
                readOnly={isViewer}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
