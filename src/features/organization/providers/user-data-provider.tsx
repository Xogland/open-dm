"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LoaderCircle } from "lucide-react";
import { redirect, usePathname } from "next/navigation"; // Import useQuery and useConvexAuth
import { useQuery, useMutation } from "convex/react";

export type Status = {
  id: string;
  label: string;
  color: string;
  isDefault: boolean;
};

// Tip: You can export this type from your Convex schema file
// to avoid redefining it.
export type OrganizationType = {
  _id: Id<"organisations">;
  _creationTime: number;
  image?: string | null | undefined;
  name: string;
  owner: Id<"users">;
  handle: string;
  plan: string;
  subscriptionStatus?: string;
  formId: Id<"forms">;
  statuses?: Status[];
  views?: number;
  debugMode?: boolean;
  stripeConfig?: {
    publishableKey: string;
    secretKey?: string;
  };
};

type UserDataContextType = {
  organizations: OrganizationType[] | null;
  selectedOrganization: OrganizationType;
  setSelectedOrganization: (organizationId: Id<"organisations">) => void;
};

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined,
);

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const organizations = useQuery(api.organisation.getAllUserOrganisations);
  const user = useQuery(api.user.getUser);
  const updateSelectedOrganisation = useMutation(api.user.updateSelectedOrganisation);

  const [selectedOrgId, setSelectedOrgId] =
    useState<Id<"organisations"> | null>(null);
  const [pendingOrgId, setPendingOrgId] = useState<Id<"organisations"> | null>(
    null,
  );

  const selectedOrganization =
    organizations?.find((org) => org._id === selectedOrgId) || null;

  useEffect(() => {
    if (organizations && organizations.length > 0 && user) {
      if (pendingOrgId) {
        const pendingOrgExists = organizations.some((org) => org._id === pendingOrgId);
        if (pendingOrgExists) {
          setSelectedOrgId(pendingOrgId);
          setPendingOrgId(null);
          return;
        }
      }

      // Validate current selectedOrgId
      if (selectedOrgId) {
        const currentOrgStillExists = organizations.some((org) => org._id === selectedOrgId);
        if (!currentOrgStillExists) {
          // If we were kicked out/org deleted, reset to fallback
          setSelectedOrgId(null);
          return;
        }
      }

      if (!selectedOrgId) {
        // Check if user has a saved selected organization
        if (user.selectedOrganisation) {
          const savedOrgExists = organizations.some(
            (org) => org._id === user.selectedOrganisation
          );
          if (savedOrgExists) {
            setSelectedOrgId(user.selectedOrganisation);
            return;
          }
        }
        // Fallback to first organization
        const fallbackOrgId = organizations[0]._id;
        setSelectedOrgId(fallbackOrgId);
        updateSelectedOrganisation({ organisationId: fallbackOrgId }).catch(console.error);
      }
    }
  }, [organizations, selectedOrgId, pendingOrgId, user, updateSelectedOrganisation]);

  function onOrganizationSelect(organizationId: Id<"organisations">) {
    if (!organizations) return;
    const organizationExists = organizations.some(
      (org: OrganizationType) => org._id === organizationId,
    );
    if (organizationExists) {
      setSelectedOrgId(organizationId);
      setPendingOrgId(null);
      // Persist to database
      updateSelectedOrganisation({ organisationId: organizationId }).catch((error: unknown) => {
        console.error("Failed to update selected organisation:", error);
      });
    } else {
      setPendingOrgId(organizationId);
      setSelectedOrgId(null);
    }
  }

  if (organizations === undefined || organizations === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (
    organizations.length === 0 &&
    !pathname.startsWith("/onboarding")
  ) {
    redirect("/onboarding");
  }

  return (
    <UserDataContext.Provider
      value={{
        organizations: organizations ?? [],
        selectedOrganization: selectedOrganization!,
        setSelectedOrganization: onOrganizationSelect,
      }}
    >
      {selectedOrganization || pathname.startsWith("/onboarding") ? (
        children
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <LoaderCircle className="animate-spin" />
        </div>
      )}
    </UserDataContext.Provider>
  );
}
