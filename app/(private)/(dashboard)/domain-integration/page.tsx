"use client";

import React from "react";
import { motion } from "framer-motion";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import {
    ExternalLink,
    ArrowRight,
    Copy,
    CheckCircle2,
    HelpCircle,
    Link2,
    Info
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";
import { Typography } from "@/components/ui/typography";

const PROVIDERS = [
    { name: "GoDaddy", url: "https://www.godaddy.com/help/forward-my-godaddy-domain-12123" },
    { name: "Namecheap", url: "https://www.namecheap.com/support/knowledgebase/article.aspx/385/2237/how-to-redirect-a-url-for-a-domain/" },
    { name: "Google Domains", url: "https://support.google.com/domains/answer/4522141" },
    { name: "Bluehost", url: "https://www.bluehost.com/help/article/how-to-redirect-a-domain" },
    { name: "Hostinger", url: "https://support.hostinger.com/en/articles/1583251-how-to-redirect-a-domain-to-another-url" },
    { name: "Domain.com", url: "https://www.domain.com/help/article/domain-management-how-to-update-domain-forwarding" },
    { name: "DreamHost", url: "https://help.dreamhost.com/hc/en-us/articles/215455377-How-do-I-redirect-one-domain-to-another-" },
    { name: "SiteGround", url: "https://www.siteground.com/kb/how-to-redirect-my-domain/" },
    { name: "A2 Hosting", url: "https://www.a2hosting.com/kb/cpanel/cpanel-domains/domain-redirects" },
    { name: "Name.com", url: "https://www.name.com/support/articles/205188658-Forwarding-a-domain" },
    { name: "Cloudflare", url: "https://developers.cloudflare.com/pages/how-to/redirects/" },
    { name: "Vercel", url: "https://vercel.com/docs/concepts/projects/domains/redirects" },
    { name: "Porkbun", url: "https://kb.porkbun.com/article/43-how-to-forward-a-domain" },
    { name: "Dynadot", url: "https://www.dynadot.com/community/help/question/forward-domain" },
    { name: "Register.com", url: "https://help.register.com/article/how-do-i-forward-my-domain-name-to-another-url" },
    { name: "Network Solutions", url: "https://knowledge.networksolutions.com/article/how-do-i-redirect-one-domain-to-another" },
    { name: "Gandi.net", url: "https://docs.gandi.net/en/domain_names/common_operations/web_redirection.html" },
    { name: "OVHcloud", url: "https://docs.ovh.com/gb/en/domains/redirect-domain-name/" },
    { name: "Ionos", url: "https://www.ionos.com/help/domains/configuring-domain-redirects/redirecting-a-domain-to-another-url/" },
    { name: "HostGator", url: "https://www.hostgator.com/help/article/how-to-create-a-redirect" },
];

export default function DomainIntegrationPage() {
    const { selectedOrganization } = useUserData();
    const hostUrl = typeof window !== "undefined" ? window.location.origin : "https://open-dm.com";
    const orgHandle = selectedOrganization?.handle || "your-handle";
    const redirectUrl = `${hostUrl}/${orgHandle}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(redirectUrl);
        toast.success("URL copied to clipboard!");
    };

    return (
        <PageShell>
            {/* Header */}
            <PageHeader
                title="Domain Integration"
                description={`Connect your custom domain to ${selectedOrganization?.name || "your organization"} for a professional look.`}
            />

            <div className="max-w-6xl space-y-12">
                {/* Connection Guide Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl overflow-hidden group border-t-4 border-t-primary/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Link2 className="w-5 h-5" />
                                </div>
                                1. Destination URL
                            </CardTitle>
                            <Typography variant="muted" as="p" className="mt-2">
                                Copy this unique link for your redirection settings.
                            </Typography>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/40 border group-hover:border-primary/30 transition-all">
                                <code className="text-[13px] font-mono truncate flex-1 text-primary font-medium tracking-tight">
                                    {redirectUrl}
                                codes>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={copyToClipboard}
                                        className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                            </div>
                            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/10 text-xs text-muted-foreground italic">
                                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <Typography variant="small" as="p">Tip: You can use a subdomain like <span className="text-foreground font-semibold">contact.yourdomain.com</span> for a cleaner setup.</Typography>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl overflow-hidden border-t-4 border-t-green-500/50">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                2. DNS Forwarding
                            </CardTitle>
                            <Typography variant="muted" as="p" className="mt-2">
                                Configure the redirect in your domain registrar's panel.
                            </Typography>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ul className="space-y-3.5">
                                {[
                                    "Log in to your domain provider settings.",
                                    "Navigate to DNS Management or Forwarding.",
                                    "Paste your destination URL from Step 1.",
                                    "Set to 301 (Permanent) redirect.",
                                    "Save changes (Ready in 24-48 hours)."
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4 text-[13px] text-foreground/80 leading-tight items-start">
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold shrink-0 mt-0.5 shadow-sm">
                                            {i + 1}
                                        </span>
                                        <span className="font-medium">{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Tutorial Links Section */}
                <div className="space-y-8 pb-12">
                    <div className="space-y-2">
                        <Typography variant="h2" className="flex items-center gap-3 border-none pb-0">
                            <HelpCircle className="w-6 h-6 text-primary" />
                            Provider Tutorials
                        </Typography>
                        <Typography variant="muted" as="p" className="max-w-2xl">
                            Follow specific step-by-step instructions for your domain registrar.
                        </Typography>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {PROVIDERS.map((provider, index) => (
                            <motion.div
                                key={provider.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                            >
                                <a
                                    href={provider.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block p-4 rounded-xl border bg-card/30 hover:bg-card hover:border-primary/30 transition-all duration-300 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-sm group-hover:text-primary transition-colors">
                                            {provider.name}
                                        </span>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                                        View Guide <ArrowRight className="w-3 h-3" />
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-12 border-t mt-auto text-center shrink-0">
                <Typography variant="muted" as="p" className="font-medium flex items-center justify-center gap-2">
                    Need more help? <Button variant="link" className="p-0 h-auto font-bold text-primary">Contact Support</Button>
                </Typography>
            </div>
        </PageShell>
    );
}
