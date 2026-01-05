import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/features/dashboard/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="flex w-full h-full">
      <Sidebar />
      <main className="flex flex-col w-full h-full">
        <SidebarTrigger className="md:hidden" />
        <div className="w-full h-full flex-1 flex flex-col">{children}</div>
      </main>
    </SidebarProvider>
  );
}
