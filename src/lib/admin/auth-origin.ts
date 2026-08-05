export type AdminAuthEnvironment = {
  ADMIN_AUTH_ORIGIN?: string;
  VERCEL_BRANCH_URL?: string;
  VERCEL_ENV?: string;
};

function normalizeOrigin(value: string | undefined) {
  if (!value) return null;
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return url.pathname === "/" && !url.search && !url.hash ? url.origin : null;
  } catch {
    return null;
  }
}

export function getAdminAuthOrigin(
  requestOrigin: string,
  environment: AdminAuthEnvironment = {
    ADMIN_AUTH_ORIGIN: process.env.ADMIN_AUTH_ORIGIN,
    VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  },
) {
  const configured = normalizeOrigin(environment.ADMIN_AUTH_ORIGIN);
  if (configured) return configured;

  if (environment.VERCEL_ENV === "preview") {
    const branchOrigin = normalizeOrigin(environment.VERCEL_BRANCH_URL);
    if (branchOrigin) return branchOrigin;
  }

  return normalizeOrigin(requestOrigin) || requestOrigin;
}
