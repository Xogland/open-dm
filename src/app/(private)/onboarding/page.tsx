import OnboardingPage from "@/features/onboarding/components/onboarding-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function Page() {
  return <OnboardingPage />;
}
