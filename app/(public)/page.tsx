import { Metadata } from "next";
import { LandingClient } from "./landing-client";

export const metadata: Metadata = {
  title: "OpenDM: The Professional Contact Link to Monetize & Filter Inquiries",
  description: "Capture intent, qualify leads, and filter spam. OpenDM turns your contact link into a structured portal for paid consultations, partnerships, and serious inquiries. Start Free.",
};

export default function Home() {
  return <LandingClient />;
}
