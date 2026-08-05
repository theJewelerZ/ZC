import type { NextConfig } from "next";

const supabaseOrigin = "https://odwkuzaudafkmgbsduou.supabase.co";
const securityHeaders = [
  { key: "Content-Security-Policy", value: [
    "default-src 'self'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "object-src 'none'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'", `img-src 'self' data: blob: ${supabaseOrigin}`,
    "font-src 'self' data:", "frame-src https://challenges.cloudflare.com",
    `connect-src 'self' https://challenges.cloudflare.com https://vitals.vercel-insights.com ${supabaseOrigin}`,
    "upgrade-insecure-requests",
  ].join("; ") },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/admin/:path*", headers: [...securityHeaders, { key: "Cache-Control", value: "private, no-store, max-age=0" }, { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
      { source: "/auth/:path*", headers: [...securityHeaders, { key: "Cache-Control", value: "private, no-store, max-age=0" }, { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] },
      { source: "/(.*)", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
