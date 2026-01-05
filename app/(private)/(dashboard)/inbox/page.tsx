import InboxPage from "@/features/inbox/components/inbox-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox",
};

export default function Page() {
  return <InboxPage />;
}
