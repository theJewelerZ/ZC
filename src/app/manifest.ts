import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/field",
    name: "Zarka Field",
    short_name: "Zarka",
    description: "Private field documentation for Zarka Construction builds.",
    start_url: "/field",
    scope: "/",
    display: "standalone",
    background_color: "#0B1F33",
    theme_color: "#0B1F33",
    orientation: "portrait-primary",
    icons: [
      { src: "/pwa/zarka-field-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa/zarka-field-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}