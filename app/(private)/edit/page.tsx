
import EditFormPage from "@/features/form-editor/components/edit-form-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Form Editor",
  description: "Edit your form content and workflows",
};

export default function Page() {
  return <EditFormPage />;
}
