import { Metadata } from "next";
import { HowItWorksContent } from "./how-it-works-content";

export const metadata: Metadata = {
    title: "How It Works | OpenDM - Your Professional Contact Journey",
    description: "Learn how OpenDM transforms your inbound communication in three simple steps: Create your gateway, share your link, and manage qualified inquiries. Compare with traditional forms and see implementation options.",
};

export default function HowItWorksPage() {
    return <HowItWorksContent />;
}
