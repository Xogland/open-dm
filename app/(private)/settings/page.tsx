"use client";

import React, { useState } from "react";
import Organization from "@/features/organization/components/organization-settings-page";
import { PageHeader } from "@/components/page-header";
import { PageShell } from "@/components/page-shell";
import { Typography } from "@/components/ui/typography";


const EmailSettingsForm = () => {
  return (
    <form className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Typography variant="small" as="h4">Email Provider</Typography>
          <select className="w-full px-3 py-2 border rounded-md">
            <option>Amazon SES</option>
            <option>Resend</option>
            <option>Postmark</option>
          </select>
        </div>

        <div className="space-y-2">
          <Typography variant="small" as="h4">API Key</Typography>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter API key"
          />
        </div>
      </div>
    </form>
  );
};

const BillingForm = () => {
  return (
    <form className="space-y-8">
      <div className="space-y-2">
        <Typography variant="small" as="h4">Payment Method</Typography>
        <input
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter card details"
        />
      </div>
    </form>
  );
};

const ProfileForm = () => {
  return (
    <form className="space-y-8">
      <div className="space-y-2">
        <Typography variant="small" as="h4">Full Name</Typography>
        <input
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter your name"
        />
      </div>
    </form>
  );
};

// --- Navigation Data ---

// Key used for internal state management and conditional rendering
const sidebarNavItems = [
  {
    title: "Organization",
    key: "organization",
    description: "Manage your organization and team members.",
    component: Organization,
  },
  {
    title: "Email Provider",
    key: "email",
    description: "Configure your email service provider.",
    component: EmailSettingsForm,
  },
  {
    title: "Billing",
    key: "billing",
    description: "Manage your subscription and billing information.",
    component: BillingForm,
  },
  {
    title: "Profile",
    key: "profile",
    description: "Update your personal information.",
    component: ProfileForm,
  },
];

// --- Sidebar Component (State-driven) ---

const SidebarNav = ({ items, activeKey, onSelect }: {
  items: typeof sidebarNavItems,
  activeKey: string,
  onSelect: (key: string) => void
}) => {
  return (
    <nav className="flex flex-col space-y-1">
      {items.map((item) => (
        <button
          key={item.key}
          // Use a button instead of an anchor tag since we're using React state
          onClick={() => onSelect(item.key)}
          className={`flex items-center px-3 py-2 text-sm rounded-md text-left transition-colors 
                                ${item.key === activeKey
              ? "bg-muted hover:bg-muted" // Active style
              : "hover:bg-accent hover:text-accent-foreground" // Inactive style
            }`}
        >
          {item.title}
        </button>
      ))}
    </nav>
  );
};

// --- Main Settings Component (Refactored) ---

export default function Settings() {
  // State to track which settings section is currently active
  const [activeSectionKey, setActiveSectionKey] = useState(sidebarNavItems[0].key);

  // Get the data for the currently selected section
  const activeSection = sidebarNavItems.find(item => item.key === activeSectionKey);
  const ActiveFormComponent = activeSection?.component;

  return (
    <PageShell>
      <PageHeader title="Settings" />

      <div className="flex flex-col lg:flex-row lg:space-x-12 space-y-6 lg:space-y-0">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/5">
          <SidebarNav
            items={sidebarNavItems}
            activeKey={activeSectionKey}
            onSelect={setActiveSectionKey}
          />
        </aside>

        {/* Content Area - Conditionally Rendered */}
        <div className="flex-1 lg:max-w-4xl">
          {activeSection && (
            <div className="space-y-6">
              {/* Only render the selected form component */}
              {ActiveFormComponent && <ActiveFormComponent />}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}