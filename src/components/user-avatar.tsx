"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UserAvatar({ className }: { className?: string }) {
  const user = useQuery(api.user.getUser);

  if (!user) {
    return null;
  }

  return (
    <Avatar className={className}>
      <AvatarImage src={user.image} />
      <AvatarFallback>{(user.name ?? "U")[0]}</AvatarFallback>
    </Avatar>
  );
}
