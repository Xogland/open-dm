import CreateOrganisationPage from "@/features/organization/components/create-organization-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Organization",
};

export default function Page() {
  return <CreateOrganisationPage />;
}
