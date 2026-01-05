"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
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

interface OrgDangerZoneProps {
    organisationId: Id<"organisations">;
    organisationName: string;
}

export function OrgDangerZone({ organisationId, organisationName }: OrgDangerZoneProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteOrg = useMutation(api.organisation.deleteOrganisation);
    const updateSelectedOrg = useMutation(api.user.updateSelectedOrganisation);
    const allOrgs = useQuery(api.organisation.getAllUserOrganisations);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteOrg({ organisationId });

            toast.success("Organization deleted successfully");

            // Find another organization to switch to
            const remainingOrgs = allOrgs?.filter(org => org._id !== organisationId) || [];

            if (remainingOrgs.length > 0) {
                await updateSelectedOrg({ organisationId: remainingOrgs[0]._id });
                router.push("/dashboard");
            } else {
                router.push("/organization/create");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete organization");
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
                    Permanently delete this organization and all its data. This action cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                    <div className="space-y-1">
                        <p className="font-medium text-destructive">Delete this organization</p>
                        <p className="text-sm text-muted-foreground">
                            Once you delete an organization, there is no going back. Please be certain.
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="shrink-0 gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete Organization
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-destructive/20">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the organization <span className="font-bold text-foreground">"{organisationName}"</span>,
                                    including all forms, submissions, connections, and team data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isDeleting ? "Deleting..." : "Permanently Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
