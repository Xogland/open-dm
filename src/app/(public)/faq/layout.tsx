import { Metadata } from "next";
import { FAQ_METADATA } from "@/features/landing/constants/faq-page-content";

export const metadata: Metadata = {
    title: FAQ_METADATA.title,
    description: FAQ_METADATA.description,
    keywords: FAQ_METADATA.keywords,
};

export default function FaqLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
