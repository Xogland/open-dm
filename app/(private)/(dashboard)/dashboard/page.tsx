import DashboardPage from "@/features/dashboard/components/dashboard-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
};

export default function Page() {
    return <DashboardPage />;
}
