import { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
    title: "About Us | OpenDM.io",
    description: "Learn more about OpenDM.io, our mission to transform inbound communication, and the values that drive us.",
};

export default function AboutPage() {
    return <AboutContent />;
}
