'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Typography } from '@/components/ui/typography';

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = React.use(params);
    const router = useRouter();
    const [isAccepting, setIsAccepting] = useState(false);

    const invite = useQuery(api.teamInvite.getInviteByToken, {
        token: token,
    });

    const acceptInvite = useMutation(api.teamInvite.acceptInvite);

    const handleAccept = async () => {
        setIsAccepting(true);
        try {
            await acceptInvite({ token: token });
            toast.success('Invite accepted! Redirecting...');
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            toast.error(error.message || 'Failed to accept invite');
            setIsAccepting(false);
        }
    };

    const handleDecline = () => {
        router.push('/');
    };

    if (invite === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <Typography variant="muted">Loading invite...</Typography>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!invite) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-destructive">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <XCircle className="h-6 w-6 text-destructive" />
                            <CardTitle>Invite Not Found</CardTitle>
                        </div>
                        <CardDescription>
                            This invite link is invalid or has been removed.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push('/')} className="w-full">
                            Go to Home
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (invite.status === 'expired') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-yellow-500">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-6 w-6 text-yellow-500" />
                            <CardTitle>Invite Expired</CardTitle>
                        </div>
                        <CardDescription>
                            This invite link has expired. Please request a new invite from the organization owner.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push('/')} className="w-full">
                            Go to Home
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (invite.status !== 'pending') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="h-6 w-6 text-muted-foreground" />
                            <CardTitle>Invite Already {invite.status}</CardTitle>
                        </div>
                        <CardDescription>
                            This invite has already been {invite.status}.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push('/dashboard')} className="w-full">
                            Go to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const getRoleDescription = (role: string) => {
        switch (role) {
            case "editor":
                return "Full access to manage forms and view all submissions";
            case "viewer":
                return "Restricted access to view specific service submissions only";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-center">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-2xl">
                                {invite.organisation.name.substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="text-center space-y-2">
                        <Typography variant="h3" as="h1">You&apos;re Invited!</Typography>
                        <Typography variant="muted" as="p">
                            {invite.inviterName} has invited you to join{' '}
                            <span className="font-semibold text-foreground">{invite.organisation.name}</span>
                        </Typography>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="bg-muted/50 border border-border/50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <Typography variant="small" className="text-muted-foreground">Role</Typography>
                            <Badge variant="secondary" className="capitalize">
                                {invite.role}
                            </Badge>
                        </div>
                        <Typography variant="small" className="text-muted-foreground">
                            {getRoleDescription(invite.role)}
                        </Typography>

                        {invite.role === "viewer" && (
                            <div className="pt-2 border-t border-border/50">
                                <Typography variant="small" className="text-muted-foreground block mb-2">
                                    Service Access:
                                </Typography>
                                {invite.allowedServices ? (
                                    <div className="flex flex-wrap gap-2">
                                        {invite.allowedServices.map((serviceId) => (
                                            <Badge
                                                key={serviceId}
                                                variant="outline"
                                                className="text-[10px]"
                                            >
                                                {serviceId}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <Typography variant="small" className="font-medium text-primary">All Services</Typography>
                                )}
                            </div>
                        )}                    </div>

                    <div className="flex items-start space-x-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                        <Typography variant="small" className="text-muted-foreground">
                            By accepting this invite, you&apos;ll get access to the organization based on your assigned role.
                        </Typography>
                    </div>
                </CardContent>

                <CardFooter className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={handleDecline}
                        className="flex-1 rounded-xl"
                        disabled={isAccepting}
                    >
                        Decline
                    </Button>
                    <Button
                        onClick={handleAccept}
                        className="flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20"
                        disabled={isAccepting}
                    >
                        {isAccepting ? 'Accepting...' : 'Accept Invite'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
