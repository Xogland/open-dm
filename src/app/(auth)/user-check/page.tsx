"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function UserCheckPage() {
  const user = useQuery(api.user.getUser);

  if (!user) {
    return <p>Not logged in</p>;
  }

  return <p>Hello {user.email}</p>;
}
