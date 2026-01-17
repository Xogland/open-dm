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
    title: {
      absolute: organisation.name,
    },
    description: form.properties?.description || `Contact ${organisation.name}`,
    keywords: tags,
    icons: {
      icon: organisation.image ? organisation.image : "/opendm.png",
    },
    openGraph: {
      title: organisation.name,
      description: form.properties?.description || `Contact ${organisation.name}`,
      images: organisation.image ? [organisation.image] : ["/opendm.png"],
      siteName: "OpenDM",
      type: "website",
      url: `https://opendm.com/${handle}`,
    },
    twitter: {
      card: "summary_large_image",
      title: organisation.name,
      description: form.properties?.description || `Contact ${organisation.name}`,
      images: organisation.image ? [organisation.image] : ["/opendm.png"],
      site: "https://opendm.io",
      siteId: "https://opendm.io",
    },
  };
}

export default function FormPage() {
  return <FormClient />;
}
