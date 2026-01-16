"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { UserType } from "@/features/auth/providers/user-auth-provider";

interface UserProfileFormProps {
    user: UserType | null | undefined;
    name: string;
    setName: (name: string) => void;
    isLoading: boolean;
    onUpdateProfile: (e: React.FormEvent) => void;
}

export function UserProfileForm({
    user,
    name,
    setName,
    isLoading,
    onUpdateProfile
}: UserProfileFormProps) {
    if (!user) return null;

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>
                        Manage your personal account details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onUpdateProfile} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={user.email}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                Your email address is managed by your identity provider.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || !name || name === user.name}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
