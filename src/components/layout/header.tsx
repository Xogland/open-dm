"use client";
import { APP_NAME } from "@/data/constants";
import { Button } from "@/components/ui/button";
import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { LoaderCircle, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import UserAvatar from "@/components/user-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useQuery(api.user.getUser);
  const { signOut } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      setSigningOut(false);
      console.error(
        "Error signing out:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "w-full flex items-center justify-between px-6 h-20 sticky top-0 z-50 transition-colors duration-300 border-b",
          isMobileMenuOpen
            ? "bg-background border-border"
            : "bg-background/60 backdrop-blur-xl border-border/40",
        )}
      >
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="group flex items-center gap-2 transition-transform active:scale-95"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image src={"/opendm.png"} alt={"App Logo"} width={30} height={30} />
            <Typography
              variant="subheading"
              className="text-xl cursor-pointer group-hover:text-primary transition-colors font-bold"
            >
              {APP_NAME}
            </Typography>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-lg transition-all duration-300 relative group",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <LoaderCircle className="animate-spin text-muted-foreground w-5 h-5" />
            </div>
          ) : (
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="hidden sm:block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-semibold px-4 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Popover>
                    <PopoverTrigger className="hover:opacity-80 transition-opacity p-0.5 rounded-full border border-border bg-background shadow-sm">
                      <UserAvatar />
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-64 mt-2 p-4 rounded-2xl shadow-xl border-border/60"
                      align="end"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="px-1 py-1.5">
                          <Typography variant="body" className="text-sm truncate">
                            {user?.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-xs text-muted-foreground truncate"
                          >
                            {user?.email}
                          </Typography>
                        </div>
                        <Separator className="opacity-60" />
                        <Link href="/dashboard" className="sm:hidden">
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-9 text-sm"
                          >
                            Dashboard
                          </Button>
                        </Link>
                        <Button
                          onClick={handleSignOut}
                          variant="destructive"
                          disabled={signingOut}
                          className="w-full h-9 text-sm rounded-lg shadow-sm active:scale-[0.98] transition-transform"
                        >
                          {signingOut ? (
                            <div className="flex items-center gap-2">
                              <LoaderCircle className="w-4 h-4 animate-spin" />
                              <span>Signing out...</span>
                            </div>
                          ) : (
                            "Sign Out"
                          )}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/sign-in" className="hidden sm:block">
                    <Button
                      variant="ghost"
                      className="font-semibold text-sm px-5 hover:bg-muted transition-colors rounded-full text-muted-foreground hover:text-foreground"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" className="hidden sm:block">
                    <Button className="font-bold text-sm px-6 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full hover:bg-muted transition-colors relative z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 flex flex-col pt-24 px-6 gap-8 animate-in fade-in slide-in-from-top-4 duration-150"
        >
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Typography
                    variant="subheading"
                    className={cn(
                      "text-3xl font-bold tracking-tight transition-colors py-2",
                      isActive
                        ? "text-primary/100"
                        : "text-muted-foreground/60 group-hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Typography>
                </Link>
              );
            })}
          </div>

          <Separator className="opacity-40" />

          <div className="flex flex-col gap-4">
            {!isAuthenticated ? (
              <>
                <Link href="/sign-in" className="w-full">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-xl text-lg h-14 border-2"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="w-full">
                  <Button
                    size="lg"
                    className="w-full rounded-xl text-lg h-14 font-bold shadow-xl shadow-primary/20"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard" className="w-full">
                <Button
                  size="lg"
                  className="w-full rounded-xl text-lg h-14 font-bold"
                >
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
