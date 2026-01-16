import React from "react";
import { UserDataProvider } from "@/features/organization/providers/user-data-provider";

export async function UserDataWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDataProvider>{children}</UserDataProvider>;
}
