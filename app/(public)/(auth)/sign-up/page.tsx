
import { SignUp } from "@/features/auth/components/sign-up";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function Page() {
  return <SignUp />;
}
