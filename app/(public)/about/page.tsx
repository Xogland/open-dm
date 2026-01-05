import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Us | OpenDM.io",
    description: "Learn more about OpenDM.io, our mission to transform inbound communication, and the values that drive us.",
};

export default function AboutPage() {
    return (
        <div className="container px-4 py-24 mx-auto max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About OpenDM</h1>
                <p className="text-xl text-muted-foreground">Transforming how the world handles inbound communication.</p>
            </div>

            <div className="prose prose-invert max-w-none space-y-12 text-muted-foreground text-lg">
                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                    <p>
                        OpenDM was built with a clear purpose: to bridge the gap between high-volume inbound communication and meaningful human connection. We believe that professionals, creators, and businesses deserve a &quot;front door&quot; that works for them, not against them.
                    </p>
                    <p>
                        In an era of endless noise, OpenDM provides the signal. Our platform empowers you to structure inquiries, qualify leads, and protect your most valuable asset—your time.
                    </p>
                </section>

                <section className="bg-muted/50 p-8 rounded-2xl border border-border">
                    <h2 className="text-2xl font-bold text-foreground mb-6">What We Solve</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">The Noise Problem</h3>
                            <p className="text-base text-muted-foreground">Unstructured DMs and emails lead to &#34;hey&#34; messages without context, wasting hours of your week.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">The Value Gap</h3>
                            <p className="text-base text-muted-foreground">Professionals often give away their expertise for free because there&apos;s no easy way to gate their time.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Spam & Bots</h3>
                            <p className="text-base text-muted-foreground">Generic contact forms are magnets for spam. We use intelligent qualification to keep them out.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Complexity Bloat</h3>
                            <p className="text-base text-muted-foreground">CRMs are too heavy. Email is too messy. OpenDM is the perfect middle ground.</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">Our Values</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="font-bold text-primary text-xl">1</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Privacy First</h3>
                                <p>Your email and personal data are never exposed publicly. We facilitate the conversation without compromising your security.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="font-bold text-primary text-xl">2</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Structured Flow</h3>
                                <p>Every inquiry comes with the exact information you need to make a decision. No more back-and-forth just to get the basics.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="font-bold text-primary text-xl">3</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Fair Value</h3>
                                <p>We believe in the value of your expertise. That&apos;s why we take 0% platform fees on your paid messages.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="text-center pt-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Ready to reclaim your inbox?</h2>
                    <p className="mb-8 font-medium">Join thousands of professionals who trust OpenDM.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/sign-up" className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity">
                            Get Started
                        </Link>
                        <Link href="/features" className="px-8 py-3 bg-muted text-foreground rounded-full font-bold hover:bg-muted/80 transition-colors">
                            Explore Features
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
