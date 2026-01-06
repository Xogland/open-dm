
import EditFormPage from "@/features/form-editor/components/edit-form-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Editor",
  description: "Edit your profile content and workflows",
};

export default function Page() {
  return <EditFormPage />;
}
