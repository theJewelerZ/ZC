import type { PublicBuildShareData } from "@/lib/projects/share";

export type BuildShareOutcome = "shared" | "copied" | "manual" | "cancelled";

export type BuildShareEnvironment = {
  share?: (data: ShareData) => Promise<void>;
  copy?: (value: string) => Promise<void>;
  clipboardAvailable: boolean;
};

function isCancellation(error: unknown) {
  return Boolean(error && typeof error === "object" && "name" in error && error.name === "AbortError");
}

export async function copyBuildLink(
  canonicalUrl: string,
  environment: BuildShareEnvironment,
): Promise<BuildShareOutcome> {
  if (!environment.clipboardAvailable || !environment.copy) return "manual";

  try {
    await environment.copy(canonicalUrl);
    return "copied";
  } catch {
    return "manual";
  }
}

export async function shareBuild(
  data: PublicBuildShareData,
  environment: BuildShareEnvironment,
): Promise<BuildShareOutcome> {
  if (!environment.share) return copyBuildLink(data.canonicalUrl, environment);

  try {
    await environment.share({
      title: data.title,
      text: data.description,
      url: data.canonicalUrl,
    });
    return "shared";
  } catch (error) {
    if (isCancellation(error)) return "cancelled";
    return copyBuildLink(data.canonicalUrl, environment);
  }
}
