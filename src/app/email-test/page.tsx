"use client";

import { useActionState } from "react";
import { sendTestEmailAction, type SendEmailState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming alert exists, saw it in file list
import { Loader2 } from "lucide-react"; // Common icon library in shadcn

const initialState: SendEmailState = {};

export default function EmailTestPage() {
    const [state, action, isPending] = useActionState(sendTestEmailAction, initialState);

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Amazon SES Test</CardTitle>
                    <CardDescription>
                        Send a test email to verify your Amazon SES configuration and email layout.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="to">To Email</Label>
                            <Input
                                id="to"
                                name="to"
                                type="email"
                                placeholder="recipient@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                name="subject"
                                type="text"
                                placeholder="Test Email Subject"
                                defaultValue="Test Email from OpenDM"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="htmlBody">HTML Body</Label>
                            <Textarea
                                id="htmlBody"
                                name="htmlBody"
                                placeholder="<h1>Hello!</h1><p>This is a test email.</p>"
                                className="min-h-[200px] font-mono text-sm"
                                defaultValue="<h1>Hello World</h1><p>This is a test email sent from the OpenDM Test Page.</p>"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="textBody">
                                Text Body <span className="text-muted-foreground text-xs">(Optional, auto-generated if empty)</span>
                            </Label>
                            <Textarea
                                id="textBody"
                                name="textBody"
                                placeholder="Hello! This is a test email."
                                className="min-h-[100px] font-mono text-sm"
                            />
                        </div>

                        {state.error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{state.error}</AlertDescription>
                            </Alert>
                        )}

                        {state.success && (
                            <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900">
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>
                                    Email sent successfully! Message ID: {state.messageId}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Test Email"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
