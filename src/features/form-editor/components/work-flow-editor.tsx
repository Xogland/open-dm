'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Loader2, Mail, Inbox, ShieldCheck, ChevronRight, Users, Bell, ArrowRight } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface WorkFlowEditorProps {
    organisationId: string;
    services: { id: string; title: string }[];
    readOnly?: boolean;
}

export default function WorkFlowEditor({
    organisationId,
    services,
    readOnly = false
}: WorkFlowEditorProps) {
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    const members = useQuery(
        api.organisation.getOrganisationMembersForRouting,
        { organisationId: organisationId as Id<"organisations"> }
    );

    const updateEscalation = useMutation(api.organisation.updateMemberEscalation);

    useEffect(() => {
        if (services.length > 0 && !selectedServiceId) {
            setSelectedServiceId(services[0].id);
        }
    }, [services, selectedServiceId]);

    if (!members) {
        return (
            <div className="w-full h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

    const handleInboxToggle = async (member: any, serviceId: string, isChecked: boolean) => {
        if (readOnly) return;

        const allServiceIds = services.map(s => s.id);
        let newAllowed: string[];

        if (member.allowedServices === undefined) {
            // Currently has full access, start with all services
            newAllowed = [...allServiceIds];
        } else {
            // Start with current restricted list, filtered for existence
            newAllowed = (member.allowedServices as string[]).filter(id => allServiceIds.includes(id));
        }

        if (isChecked) {
            if (!newAllowed.includes(serviceId)) {
                newAllowed.push(serviceId);
            }
        } else {
            newAllowed = newAllowed.filter(id => id !== serviceId);
        }

        // If newAllowed contains all currently available services, 
        // set back to undefined to represent "Full Access"
        let finalAllowed: string[] | undefined = newAllowed;
        const hasAll = allServiceIds.every(id => newAllowed.includes(id));

        if (hasAll && allServiceIds.length > 0) {
            finalAllowed = undefined;
        }

        try {
            await updateEscalation({
                membershipId: member.membershipId,
                allowedServices: finalAllowed
            });
            toast.success("Inbox access updated");
        } catch (error: any) {
            toast.error(error.message || "Failed to update inbox access");
        }
    };

    const handleEscalationUpdate = async (member: any, serviceId: string, updates: { enabled: boolean }) => {
        if (readOnly) return;

        const currentEscalation = member.serviceEscalation || {};
        const serviceConfig = currentEscalation[serviceId] || {};

        const newEscalation = {
            ...currentEscalation,
            [serviceId]: {
                ...serviceConfig,
                ...updates
            }
        };

        try {
            await updateEscalation({
                membershipId: member.membershipId,
                serviceEscalation: newEscalation
            });
            toast.success("Routing updated");
        } catch (error: any) {
            toast.error(error.message || "Failed to update routing");
        }
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-background overflow-hidden border-t">
            {/* Sidebar: Services List */}
            <div className="w-full md:w-80 border-r border-border/50 flex flex-col bg-muted/5 shrink-0 overflow-hidden">
                <div className="h-[88px] px-6 flex flex-col justify-center border-b border-border/50 bg-background/50 backdrop-blur-xl shrink-0">
                    <Typography variant="small" as="h3" className="font-bold flex items-center gap-2">
                        Select Service
                    </Typography>
                    <Typography variant="muted" as="p" className="text-[11px] mt-0.5">Configure routing per service</Typography>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => setSelectedServiceId(service.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group text-left",
                                    selectedServiceId === service.id
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm truncate">{service.title}</span>
                                    <span className={cn(
                                        "text-[10px] truncate",
                                        selectedServiceId === service.id ? "text-primary-foreground/70" : "text-muted-foreground"
                                    )}>
                                        Manage rules
                                    </span>
                                </div>
                                <ChevronRight className={cn(
                                    "w-4 h-4 transition-transform group-hover:translate-x-1",
                                    selectedServiceId === service.id ? "opacity-100" : "opacity-0"
                                )} />
                            </button>
                        ))}
                        {services.length === 0 && (
                            <div className="p-8 text-center">
                                <Inbox className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                <p className="text-xs text-muted-foreground">No services found. Add them in Profile & Content.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Area: Member Routing Config */}
            <div className="flex-1 flex flex-col overflow-hidden bg-background">
                {!selectedService ? (
                    <div className="flex-1 flex items-center justify-center p-12 text-center">
                        <div className="max-w-xs space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
                                <Users className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <Typography variant="h4" as="h3" className="font-bold">Select a Service</Typography>
                            <Typography variant="muted" as="p">
                                Select a service from the list on the left to configure routing and email escalations for your team.
                            </Typography>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="h-[88px] px-6 border-b border-border/50 bg-background/50 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                            <div className="flex flex-col justify-center">
                                <Typography variant="h3" as="h2" className="flex items-center gap-3 border-none pb-0 leading-none">
                                    {selectedService.title}
                                    <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Routing Config</span>
                                </Typography>
                                <Typography variant="muted" as="p" className="mt-1.5 text-[11px] leading-none">Determine who gets notified and who can view submissions.</Typography>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] text-muted-foreground bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-primary" />
                                    <span>GRANULAR MEMBER ACCESS</span>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-6 bg-muted/5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                                {members.map((member) => {
                                    const isAssigned = member.allowedServices === undefined ||
                                        member.allowedServices.includes(selectedService.id);

                                    const config = member.serviceEscalation?.[selectedService.id] || { enabled: false, email: member.email };
                                    const isEscalated = config.enabled;

                                    return (
                                        <Card key={member._id} className={cn(
                                            "border-border/50 shadow-sm transition-all duration-300 hover:shadow-md",
                                            isAssigned ? "bg-background" : "bg-muted/5 border-dashed"
                                        )}>
                                            <CardHeader className="p-4 space-y-0">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                                            <AvatarImage src={member.image} />
                                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                                {member.name?.substring(0, 2) || "??"}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <Typography variant="small" className="font-bold truncate">{member.name || "Unnamed"}</Typography>
                                                                <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{member.role}</span>
                                                            </div>
                                                            <Typography variant="muted" as="p" className="text-xs truncate italic">{member.email}</Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 space-y-3">
                                                {/* Inbox Access */}
                                                <div className={cn(
                                                    "rounded-xl p-4 transition-all duration-300",
                                                    isAssigned ? "bg-blue-500/5 border border-blue-500/10" : "bg-muted/10 border border-transparent"
                                                )}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Inbox className={cn("w-3.5 h-3.5", isAssigned ? "text-blue-500" : "text-muted-foreground")} />
                                                            <div className="flex flex-col text-left">
                                                                <Typography variant="small" className="text-[10px]">Inbox Access</Typography>
                                                                <Typography variant="muted" className="text-[10px]">View service submissions</Typography>
                                                            </div>
                                                        </div>
                                                        <Switch
                                                            checked={isAssigned}
                                                            onCheckedChange={(checked) => handleInboxToggle(member, selectedService.id, checked)}
                                                            disabled={readOnly}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Email Escalation */}
                                                <div className={cn(
                                                    "rounded-xl p-4 transition-all duration-300",
                                                    isEscalated ? "bg-primary/5 border border-primary/10" : "bg-muted/10 border border-transparent"
                                                )}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Bell className={cn("w-3.5 h-3.5", isEscalated ? "text-primary" : "text-muted-foreground")} />
                                                            <div className="flex flex-col text-left">
                                                                <Typography variant="small" className="text-[10px]">Email Escalation</Typography>
                                                                <Typography variant="muted" className="text-[10px]">Notify at {member.email}</Typography>
                                                            </div>
                                                        </div>
                                                        <Switch
                                                            checked={isEscalated}
                                                            onCheckedChange={(checked) => handleEscalationUpdate(member, selectedService.id, { enabled: checked })}
                                                            disabled={readOnly}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </>
                )}
            </div>
        </div>
    );
}
