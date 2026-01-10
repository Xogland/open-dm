'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Users,
  ShieldCheck,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { useTeamManagement, useTeamAccess } from "../hooks/use-team-access";
import { InviteDialog } from "./invite-dialog";
import { toast } from "sonner";
import { getPlanConfig } from "@/features/subscription/config/plan-config";
import { PageShell } from "@/components/page-shell";
import { Typography } from "@/components/ui/typography";

export default function TeamsPage() {
  const { selectedOrganization } = useUserData();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const formData = useQuery(
    api.form.getFormByOrganisationId,
    selectedOrganization ? { organisationId: selectedOrganization._id } : "skip"
  );

  const {
    members,
    invites,
    createInvite,
    removeTeamMember,
    updateTeamMemberRole,
    isLoading,
  } = useTeamManagement(selectedOrganization?._id);

  const { role: currentUserRole } = useTeamAccess(selectedOrganization?._id);

  const services = formData?.services || [];

  const isOwner = currentUserRole === "owner";
  const isEditor = currentUserRole === "editor";
  const isViewer = currentUserRole === "viewer";
  const canManageTeam = isOwner || isEditor;
  const subscriptionExpired = selectedOrganization?.subscriptionStatus !== "active";

  const activeMembers = members.filter((m: any) => {
    return !searchQuery ||
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pendingInvites = invites.filter((i: any) => i.status === "pending");

  // Limit Check
  const plan = selectedOrganization?.plan;
  const planConfig = plan ? getPlanConfig(plan as any) : null;
  const teamLimit = planConfig?.limits.teamMembersLimit ?? 0;

  const activeMembersMemberOnly = members.filter((m: any) => m.role !== "owner");
  const currentCount = activeMembersMemberOnly.length + pendingInvites.length;

  const isTeamLimitReached = teamLimit !== Infinity && currentCount >= teamLimit;

  const handleRemoveMember = async (userId: string) => {
    if (!selectedOrganization) return;
    try {
      await removeTeamMember({
        organisationId: selectedOrganization._id,
        userId: userId as any,
      });
      toast.success("Team member removed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove team member");
    }
  };

  const handleChangeRole = async (userId: string, newRole: "editor" | "viewer") => {
    if (!selectedOrganization) return;
    try {
      await updateTeamMemberRole({
        organisationId: selectedOrganization._id,
        userId: userId as any,
        role: newRole,
      });
      toast.success("Role updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update role");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "editor":
        return "secondary";
      case "viewer":
        return "outline";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="space-y-8 animate-pulse">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Skeleton className="flex-1 w-full rounded-xl" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Header */}
      <PageHeader
        title="Team Management"
        description="Manage your organization members and their access roles."
      >
        {canManageTeam && !subscriptionExpired && (
          <Button className="h-10 px-6 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2" onClick={() => setInviteDialogOpen(true)}>
            <Plus className="w-4 h-4" /> Invite Member
          </Button>
        )}
      </PageHeader>

      {/* Subscription Warning */}
      {subscriptionExpired && (
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-semibold">
            Your subscription has expired. Team members cannot access the organization until you renew your subscription.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border shadow-sm rounded-xl overflow-hidden bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle><Typography variant="subheading" className="text-xs text-muted-foreground">Total Members</Typography></CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Typography variant="stat" className="text-3xl">{members.length}</Typography>
          </CardContent>
        </Card>
        <Card className="border shadow-sm rounded-xl overflow-hidden bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle><Typography variant="subheading" className="text-xs text-muted-foreground">Active Status</Typography></CardTitle>
            <ShieldCheck className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <Typography variant="stat" className="text-3xl">
              {members.filter((m: any) => !subscriptionExpired).length}
            </Typography>
          </CardContent>
        </Card>
        <Card className="border shadow-sm rounded-xl overflow-hidden bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle><Typography variant="subheading" className="text-xs text-muted-foreground">Pending Invites</Typography></CardTitle>
            <UserPlus className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <Typography variant="stat" className="text-3xl">{pendingInvites.length}</Typography>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-xl border shadow-sm shrink-0">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 w-full bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
            <span className="font-bold text-foreground">
              {activeMembers.length}
            </span>
            Members found
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-card rounded-xl border shadow-sm">
          <Table>
            <TableHeader className="bg-muted/30 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="py-4 text-foreground">Member</TableHead>
                <TableHead className="py-4 text-foreground">Role</TableHead>
                <TableHead className="py-4 text-foreground">Status</TableHead>
                <TableHead className="py-4 text-right text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeMembers.map((member: any) => (
                <TableRow key={member._id} className="hover:bg-accent/40 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={member.image} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name?.substring(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <Typography variant="body" className="font-semibold text-sm truncate">{member.name || "Unknown"}</Typography>
                        <Typography variant="caption" className="text-xs text-muted-foreground truncate">{member.email}</Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={getRoleBadgeVariant(member.role)} className="capitalize px-2.5 py-0.5 rounded-full text-[10px]">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${subscriptionExpired && member.role !== "owner" ? "bg-muted-foreground/30" : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"}`} />
                      <span className={`text-xs ${subscriptionExpired && member.role !== "owner" ? "text-muted-foreground" : "text-foreground"}`}>
                        {subscriptionExpired && member.role !== "owner" ? "Inactive" : "Active"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {canManageTeam && member.role !== "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-border/50">
                          <DropdownMenuLabel className="text-[10px] text-muted-foreground px-2 py-1.5">Manage Access</DropdownMenuLabel>
                          <DropdownMenuItem className="rounded-lg cursor-pointer text-xs" onClick={() => handleChangeRole(member._id, "editor")}>
                            Set as Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer text-xs" onClick={() => handleChangeRole(member._id, "viewer")}>
                            Set as Viewer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 opacity-50" />
                          {isOwner && (
                            <DropdownMenuItem
                              className="rounded-lg cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/5"
                              onClick={() => handleRemoveMember(member._id)}
                            >
                              Remove from Organization
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Invite Dialog */}
      <InviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        organisationId={selectedOrganization!._id}
        services={services}
        onCreateInvite={createInvite}
        plan={plan}
        isLimitReached={isTeamLimitReached}
        limit={teamLimit}
        currentCount={currentCount}
      />
    </PageShell>
  );
}