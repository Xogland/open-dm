import { Metadata } from "next";
import { FeaturesContent } from "./features-content";

export const metadata: Metadata = {
    title: "Features | OpenDM - The Intelligent Contact Intake Layer",
    description: "Explore the powerful features of OpenDM: Intelligent inquiry routing, priority monetization, inbound CRM, custom domains, and more. Built for serious professionals.",
};

export default function FeaturesPage() {
    return <FeaturesContent />;
}
