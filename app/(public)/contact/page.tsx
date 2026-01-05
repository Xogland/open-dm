import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <div className="container px-4 py-24 mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground mb-12">
                Have questions or need help? Reach out to us and we'll get back to you as soon as possible.
            </p>

            <form className="space-y-6 text-left border border-border p-8 rounded-3xl bg-card">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="How can we help?" className="min-h-[150px]" />
                </div>
                <Button className="w-full h-12 text-lg font-bold">Send Message</Button>
            </form>
        </div>
    );
}
