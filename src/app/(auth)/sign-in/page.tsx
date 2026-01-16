
import { SignIn } from "@/features/auth/components/sign-in";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

import { AuthLayout } from "@/features/auth/components/auth-layout";

export default function Page() {
  return (
    <AuthLayout mode="sign-in">
      <SignIn />
    </AuthLayout>
  );
}
