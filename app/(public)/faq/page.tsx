"use client";

import { FAQAccordion } from "@/features/landing/components/faq-accordion";
import { SUPPORT_CONTENT } from "@/features/landing/constants/faq-page-content";
import { SectionWrapper, SectionHeader } from "@/features/landing/components/section-wrapper";
import { FinalCTA } from "@/features/landing/components/final-cta";
import Link from "next/link";
import { HelpCircle, MessageSquare } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import Image from "next/image";

export default function FaqPage() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <SectionWrapper bg="muted" className="pt-32 pb-16 md:pt-48 md:pb-24">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-primary rounded-full blur-[100px]" />
                </div>

                <SectionHeader
                    badge="Support Center"
                    badgeIcon={HelpCircle}
                    title="OpenDM FAQs & Help Center"
                    description="Get answers about our professional contact link, paid DM features, spam filtering, and how to monetize inquiries."
                />

                <div className="flex items-center justify-center gap-2 mt-8 py-2 px-6 rounded-full bg-background border shadow-sm w-fit mx-auto">
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden relative">
                                <Image
                                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                    alt="User"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <Typography variant="small" className="ml-2">5,000+ Professionals Helped</Typography>
                </div>
            </SectionWrapper>

            {/* Main FAQ Content */}
            <SectionWrapper className="py-24">
                <div className="max-w-4xl mx-auto">
                    <FAQAccordion />
                </div>
            </SectionWrapper>

            {/* Still Need Help Section */}
            <SectionWrapper bg="muted" className="py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-6">
                        <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                    <Typography variant="h2" className="mb-6 border-none">{SUPPORT_CONTENT.title}</Typography>
                    <Typography variant="lead" className="mb-12">{SUPPORT_CONTENT.description}</Typography>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {SUPPORT_CONTENT.contacts.map((contact) => (
                            <Link
                                key={contact.label}
                                href={`https://${contact.link}`}
                                target="_blank"
                                className="flex flex-col items-center p-6 rounded-2xl bg-background border hover:border-primary hover:shadow-lg transition-all group"
                            >
                                <Typography variant="muted" className="mb-2">
                                    {contact.label === 'Support' ? 'OpenDM us @' : 'OpenDM me @'}
                                </Typography>
                                <Typography variant="large" className="group-hover:text-primary transition-colors">{contact.link}</Typography>
                                <span className="mt-4 px-3 py-1 rounded-full bg-muted text-xs font-semibold">{contact.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </SectionWrapper>

            {/* Pre-CTA Social Proof */}
            <div className="w-full bg-background pt-24 pb-32 flex items-center justify-center">
                <div className="container px-4 text-center flex items-center justify-center">
                    <Typography variant="lead" className="md:text-2xl max-w-3xl mx-auto leading-relaxed">
                        Join <span className="text-foreground font-bold italic">15,000+ professionals</span> who use OpenDM to save time, filter spam, and monetize their expertise.
                    </Typography>
                </div>
            </div>

            <FinalCTA />
        </div>
    );
}
