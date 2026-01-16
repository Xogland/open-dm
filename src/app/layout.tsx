import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/providers/convex-client-provider";
import React from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://opendm.io"),
  title: {
    default: "OpenDM | The Professional Contact Link to Monetize & Filter Inquiries",
    template: "%s | OpenDM",
  },
  description: "Capture intent, qualify leads, and filter spam. OpenDM turns your contact link into a structured portal for paid consultations, partnerships, and serious inquiries.",
  keywords: ["OpenDM", "Contact Link", "Lead Qualification", "Paid DMs", "Inbox Management", "SaaS"],
  authors: [{ name: "OpenDM Team" }],
  creator: "OpenDM",
  publisher: "OpenDM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://opendm.io",
    siteName: "OpenDM",
    title: "OpenDM | The Professional Contact Link",
    description: "Monetize and filter your inquiries with a professional structured portal.",
    images: [
      {
        url: "/og-image.png", // Assuming this will be created or exists
        width: 1200,
        height: 630,
        alt: "OpenDM - Professional Contact Link",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenDM | The Professional Contact Link",
    description: "Monetize and filter your inquiries with a professional structured portal.",
    images: ["/og-image.png"],
    creator: "@opendm",
  },
  icons: {
    icon: "/opendm.png",
    shortcut: "/opendm.png",
    apple: "/opendm.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              forcedTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <main className="w-full h-screen">{children}</main>
            </ThemeProvider>
            <Toaster />
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
