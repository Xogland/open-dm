import React from "react";
import { UserDataWrapper } from "@/wrappers/user-data-wrapper";
import { UserAuthProvider } from "@/features/auth/providers/user-auth-provider";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Private Layout");
  return (
    <UserAuthProvider>
      <UserDataWrapper>{children}</UserDataWrapper>
    </UserAuthProvider>
  );
}
