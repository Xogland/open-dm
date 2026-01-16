'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TeamRole } from "@/lib/types";

export function useTeamAccess(organisationId: Id<"organisations"> | undefined) {
    const access = useQuery(
        api.organisation.checkUserAccess,
        organisationId ? { organisationId } : "skip"
    );

    return {
        role: access?.role || null,
        status: access?.status || null,
        canEditForm: access?.canEditForm || false,
        canViewAllSubmissions: access?.canViewAllSubmissions || false,
        allowedServices: access?.allowedServices,
        isActive: access?.isActive || false,
        isLoading: access === undefined,
    };
}

export function useTeamManagement(organisationId: Id<"organisations"> | undefined) {
    const members = useQuery(
        api.organisation.getOrganisationMembers,
        organisationId ? { organisation: organisationId } : "skip"
    );

    const invites = useQuery(
        api.teamInvite.getOrganisationInvites,
        organisationId ? { organisationId } : "skip"
    );

    const createInvite = useMutation(api.teamInvite.createInvite);
    const cancelInvite = useMutation(api.teamInvite.cancelInvite);
    const removeTeamMember = useMutation(api.organisation.removeTeamMember);
    const updateTeamMemberRole = useMutation(api.organisation.updateTeamMemberRole);

    return {
        members: members || [],
        invites: invites || [],
        createInvite,
        cancelInvite,
        removeTeamMember,
        updateTeamMemberRole,
        isLoading: members === undefined || invites === undefined,
    };
}
