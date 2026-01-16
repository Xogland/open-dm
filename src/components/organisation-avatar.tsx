"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function OrganisationAvatar({
  organisation,
  className,
}: {
  organisation?: { name: string; image?: string | null };
  className?: string;
}) {
  if (!organisation) {
    return null;
  }
  return (
    <Avatar className={className}>
      <AvatarImage src={organisation.image ?? undefined} className="object-cover" />
      <AvatarFallback>{(organisation.name ?? "O")[0]}</AvatarFallback>
    </Avatar>
  );
}
