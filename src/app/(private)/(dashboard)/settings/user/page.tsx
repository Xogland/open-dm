import UserSettingsPage from "@/features/user/components/user-settings-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Settings",
};

export default function Page() {
    return <UserSettingsPage />;
}
