import OrganizationSettingsPage from "@/features/organization/components/organization-settings-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organization Settings",
};

export default function Page() {
  return <OrganizationSettingsPage />;
}