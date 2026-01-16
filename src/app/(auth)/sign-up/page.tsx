
import { SignUp } from "@/features/auth/components/sign-up";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

import { AuthLayout } from "@/features/auth/components/auth-layout";

export default function Page() {
  return (
    <AuthLayout mode="sign-up">
      <SignUp />
    </AuthLayout>
  );
}
