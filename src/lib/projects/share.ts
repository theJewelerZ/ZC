import { businessConfig } from "@/config/business";

const buildSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PublicBuildShareData = {
  title: string;
  description: string;
  canonicalUrl: string;
  xIntentUrl: string;
};

export function getCanonicalBuildUrl(slug: string) {
  if (!buildSlugPattern.test(slug)) {
    throw new Error("A published Build slug is required for sharing.");
  }

  return new URL(`/projects/${slug}`, businessConfig.canonicalUrl).toString();
}

export function getBuildShareData(input: {
  slug: string;
  title: string;
  description: string;
}): PublicBuildShareData {
  const canonicalUrl = getCanonicalBuildUrl(input.slug);
  const xText = `${input.title} | Inside the Build`;
  const xIntent = new URL("https://x.com/intent/post");
  xIntent.searchParams.set("text", xText);
  xIntent.searchParams.set("url", canonicalUrl);

  return {
    title: input.title,
    description: input.description,
    canonicalUrl,
    xIntentUrl: xIntent.toString(),
  };
}
