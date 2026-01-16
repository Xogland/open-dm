import ConnectionsPage from "@/features/connections/components/connections-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connections",
};

export default function Page() {
  return <ConnectionsPage />;
}
