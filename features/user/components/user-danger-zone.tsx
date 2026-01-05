"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, AlertTriangle } from "lucide-react";

export function UserDangerZone() {
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteUser = useMutation(api.user.deleteUser);
    const { signOut } = useAuthActions();

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteUser();

            toast.success("Account deleted successfully");

            // Sign out after deletion
            await signOut();
            window.location.href = "/"; // Redirect to landing page
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete account");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
                <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <CardTitle>Danger Zone</CardTitle>
                </div>
                <CardDescription>
                    Permanently delete your account and all associated data. This action cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                    <div className="space-y-1">
                        <p className="font-medium text-destructive">Delete your account</p>
                        <p className="text-sm text-muted-foreground">
                            Deleting your account will also delete all organizations you own. This is permanent.
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="shrink-0 gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-destructive/20">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete your profile and <span className="text-destructive font-bold">ALL</span> organizations you own.
                                    You will lose access to all your data and forms.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? "Deleting..." : "Permanently Delete Account"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
