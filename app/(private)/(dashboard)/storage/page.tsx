import StoragePage from "@/features/storage/components/storage-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Storage",
};

export default function Page() {
    return <StoragePage />;
}