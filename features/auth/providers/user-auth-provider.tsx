"use client";

import React, { createContext, useContext } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LoaderCircle } from "lucide-react";
import { redirect, usePathname } from "next/navigation";

export type UserType = {
  _id: Id<"users">;
  _creationTime: number;
  name?: string | undefined;
  image?: string | undefined;
  email?: string | undefined;
  emailVerificationTime?: number | undefined;
  phone?: string | undefined;
  phoneVerificationTime?: number | undefined;
  isAnonymous?: boolean | undefined;
};
type UserDataContextType = {
  isAuthenticated: boolean;
  user: UserType | null | undefined;
  isLoading: boolean;
};

const UserAuthContext = createContext<UserDataContextType | undefined>(
  undefined,
);

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
}

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.user.getUser);
  const pathname = usePathname();

  if (!isLoading && !isAuthenticated) {
    redirect(`/sign-in?redirect=${pathname}`);
  }

  if (isLoading || (isAuthenticated && !user)) {
    console.log("Loading user...", isLoading, isAuthenticated, user);
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: isAuthenticated && !!user,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}
