import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import { BillingBanner } from "@/features/subscription/components/billing-banner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="flex w-full h-full flex-col md:flex-row">
      <Sidebar />
      <main className="flex flex-col w-full h-full flex-1">
        <BillingBanner />
        <SidebarTrigger className="md:hidden" />
        <div className="w-full h-full flex-1 flex flex-col">{children}</div>
      </main>
    </SidebarProvider>
  );
}
