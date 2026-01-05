"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  HomeIcon,
  LogOut,
  MailIcon,
  Settings,
  PencilIcon,
  Plus,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { MdPeopleOutline, MdStorage } from "react-icons/md";
import UserAvatar from "@/components/user-avatar";
import { useAuthActions } from "@convex-dev/auth/react";
import { CURRENT_PLATFORM_STATUS, PlatformStatus } from "@/constants/platform";
import { Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { useUserAuth } from "@/features/auth/providers/user-auth-provider";
import { Button } from "@/components/ui/button";
import { RiTeamLine } from "react-icons/ri";
import { useTeamAccess } from "@/features/teams/hooks/use-team-access";
import { OrganizationLimitModal } from "@/features/organization/components/organization-limit-modal";

const ORGANISATION_LIMIT = 15;

const items = [
  { title: "Dashboard", url: "/dashboard", icon: HomeIcon },
  { title: "Form Editor", url: "/edit", icon: PencilIcon },
  { title: "Inbox", url: "/inbox", icon: MailIcon },
  { title: "Client Management", url: "/connections", icon: MdPeopleOutline },
  { title: "Storage", url: "/storage", icon: MdStorage },
  { title: "Teams", url: "/teams", icon: RiTeamLine },
  { title: "Settings", url: "/settings/organization", icon: Settings },
  { title: "Domain Integration", url: "/domain-integration", icon: LinkIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { user } = useUserAuth();
  const { selectedOrganization, organizations, setSelectedOrganization } =
    useUserData();
  const { role: currentUserRole } = useTeamAccess(selectedOrganization?._id);
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const isOwner = currentUserRole === "owner";
  const isEditor = currentUserRole === "editor";
  const isViewer = currentUserRole === "viewer";

  const ownedOrgs = organizations?.filter((org) => org.owner === user?._id) || [];
  const memberOrgs = organizations?.filter((org) => org.owner !== user?._id) || [];

  const filteredItems = items.filter((item) => {
    if (isViewer) {
      // Viewers cannot see Teams or Settings
      return item.url !== "/teams" && !item.url.startsWith("/settings/organization") && item.url !== "/domain-integration";
    }
    return true;
  });

  const handleClick = () => {
    // Close only on small screens
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <SidebarComponent collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {user && (
            <SidebarGroupContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar>
                      <AvatarImage
                        src={selectedOrganization?.image ?? undefined}
                        alt={selectedOrganization?.name}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {selectedOrganization?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium">
                      {selectedOrganization?.name}
                    </span>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[240px]">
                  {ownedOrgs.length > 0 && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        My Organizations
                      </div>
                      {ownedOrgs.map((org) => (
                        <DropdownMenuItem
                          key={org._id}
                          className="cursor-pointer"
                          onClick={() => {
                            if (org._id !== selectedOrganization?._id) {
                              setSelectedOrganization(org._id);
                            }
                          }}
                        >
                          <Avatar className="mr-2 h-4 w-4">
                            <AvatarFallback>
                              {org.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate flex-1">{org.name}</span>
                          {org._id === selectedOrganization?._id && (
                            <Check className="ml-auto h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}

                  {memberOrgs.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Shared With Me
                      </div>
                      {memberOrgs.map((org) => (
                        <DropdownMenuItem
                          key={org._id}
                          className="cursor-pointer"
                          onClick={() => {
                            if (org._id !== selectedOrganization?._id) {
                              setSelectedOrganization(org._id);
                            }
                          }}
                        >
                          <Avatar className="mr-2 h-4 w-4">
                            <AvatarFallback>
                              {org.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate flex-1 font-normal text-muted-foreground">
                            {org.name}
                          </span>
                          {org._id === selectedOrganization?._id && (
                            <Check className="ml-auto h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      if (ownedOrgs.length >= ORGANISATION_LIMIT) {
                        e.preventDefault();
                        setIsLimitModalOpen(true);
                      }
                    }}
                    asChild={ownedOrgs.length < ORGANISATION_LIMIT && CURRENT_PLATFORM_STATUS !== PlatformStatus.PREREGISTRATION}
                    disabled={CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION}
                    className={cn(
                      CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION && "opacity-50 cursor-not-allowed",
                      ownedOrgs.length >= ORGANISATION_LIMIT && "text-muted-foreground"
                    )}
                  >
                    {CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION ? (
                      <div className="flex items-center w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Create Organization</span>
                        <Lock className="ml-auto h-3 w-3" />
                      </div>
                    ) : ownedOrgs.length >= ORGANISATION_LIMIT ? (
                      <div
                        className="flex items-center w-full cursor-pointer"
                        onClick={() => setIsLimitModalOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Create Organization</span>
                        <Lock className="ml-auto h-3 w-3" />
                      </div>
                    ) : (
                      <Link href="/onboarding" className="cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Create Organization</span>
                      </Link>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarGroupContent>
          )}
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = pathname === item.url;
                const isLocked = CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION && item.url !== "/dashboard";

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      disabled={isActive || isLocked}
                      asChild={!isLocked}
                      className={cn(isLocked && "opacity-50 cursor-not-allowed")}
                    >
                      {isLocked ? (
                        <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground w-full">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                          <Lock className="ml-auto h-3 w-3" />
                        </div>
                      ) : (
                        <Link
                          href={item.url}
                          onClick={handleClick}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 transition-colors hover:bg-muted w-full",
                            isActive
                              ? "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
                              : "",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto mb-4">
          {user && (
            <SidebarGroupContent>
              <div className="px-2 py-2">
                <SubscriptionCard />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <UserAvatar />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-full">
                  <DropdownMenuItem asChild>
                    <Link href="/settings/user" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>User Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                      router.replace("/");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
      <OrganizationLimitModal
        open={isLimitModalOpen}
        onOpenChange={setIsLimitModalOpen}
        limit={ORGANISATION_LIMIT}
      />
    </SidebarComponent>
  );
}

function SubscriptionCard() {
  const { selectedOrganization } = useUserData();

  if (!selectedOrganization) return null;

  const plan = selectedOrganization.plan || "free";
  const isBusiness = plan === "business";

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold capitalize">{plan} Plan</span>
        {!isBusiness && (
          <Button
            variant="secondary"
            size="sm"
            asChild={CURRENT_PLATFORM_STATUS !== PlatformStatus.PREREGISTRATION}
            disabled={CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION}
            className={cn("h-6 text-xs px-2", CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION && "opacity-50 cursor-not-allowed")}
          >
            {CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION ? (
              <div className="flex items-center gap-1">
                <span>Upgrade</span>
                <Lock className="h-2.5 w-2.5" />
              </div>
            ) : (
              <Link href="/pricing">Upgrade</Link>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
