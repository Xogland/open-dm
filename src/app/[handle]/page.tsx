import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { FormClient } from "./form-client";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;

  const formWithOrg = await convex.query(api.form.getFormWithOrganisationByHandle, {
    handle,
  });

  if (!formWithOrg) {
    return {
      title: "Not Found",
      description: "The requested form could not be found.",
    };
  }

  const { organisation, form } = formWithOrg;
  const tags = form.properties?.tags?.join(" | ") || "";

  return {
    title: organisation.name,
    description: form.properties?.description || `Contact ${organisation.name}`,
    keywords: tags,
    icons: {
      icon: "/opendm.png",
    },
    openGraph: {
      title: organisation.name,
      description: form.properties?.description || `Contact ${organisation.name}`,
      images: organisation.image ? [organisation.image] : ["/opendm.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: organisation.name,
      description: form.properties?.description || `Contact ${organisation.name}`,
      images: organisation.image ? [organisation.image] : ["/opendm.png"],
    },
  };
}

export default function FormPage() {
  return <FormClient />;
}
