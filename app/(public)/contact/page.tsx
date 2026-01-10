import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";

export default function ContactPage() {
    return (
        <div className="container px-4 py-24 mx-auto max-w-2xl text-center">
            <Typography variant="heading" className="text-4xl mb-6">Contact Us</Typography>
            <Typography variant="lead" className="text-xl text-muted-foreground mb-12">
                Have questions or need help? Reach out to us and we&apos;ll get back to you as soon as possible.
            </Typography>

            <form className="space-y-6 text-left border border-border p-8 rounded-3xl bg-card">
                <div className="space-y-2">
                    <Typography variant="caption" className="text-sm">Name</Typography>
                    <Input placeholder="Your name" />
                </div>
                <div className="space-y-2">
                    <Typography variant="caption" className="text-sm">Email</Typography>
                    <Input type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                    <Typography variant="caption" className="text-sm">Message</Typography>
                    <Textarea placeholder="How can we help?" className="min-h-[150px]" />
                </div>
                <Button className="w-full h-12 text-lg">Send Message</Button>
            </form>
        </div>
    );
}
