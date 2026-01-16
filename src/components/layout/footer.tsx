"use client";

import { APP_NAME } from "@/data/constants";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Typography } from "@/components/ui/typography";

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border pt-16 pb-8">
            <div className="container px-4 md:px-6 lg:px-8 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Label className="text-2xl cursor-pointer">{APP_NAME}</Label>
                        </Link>
                        <Typography variant="body">
                            The inbound platform for structured client inquiries, paid messages, and qualified contact requests.
                        </Typography>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Typography variant="subheading" as="h4" className="mb-6">Product</Typography>
                        <ul className="space-y-4">
                            <li><Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
                            <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <Typography variant="subheading" as="h4" className="mb-6">Legal</Typography>
                        <ul className="space-y-4">
                            <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <Typography variant="subheading" as="h4" className="mb-6">Support</Typography>
                        <ul className="space-y-4">
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <Typography variant="caption">
                        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                    </Typography>
                </div>
            </div>
        </footer>
    );
}
