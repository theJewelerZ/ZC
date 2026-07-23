import Image from "next/image";

import { businessConfig } from "@/config/business";

type BrandMarkProps = {
  surface?: "light" | "dark";
  format?: "horizontal" | "icon";
  className?: string;
};

export function BrandMark({
  surface = "light",
  format = "horizontal",
  className = "",
}: BrandMarkProps) {
  const asset =
    format === "icon"
      ? surface === "dark"
        ? businessConfig.logo.iconOnDark
        : businessConfig.logo.iconOnLight
      : surface === "dark"
        ? businessConfig.logo.horizontalOnDark
        : businessConfig.logo.horizontalOnLight;

  if (asset) {
    return (
      <Image
        alt={businessConfig.displayName}
        className={className}
        height={format === "icon" ? 48 : 56}
        priority
        src={asset}
        width={format === "icon" ? 48 : 220}
      />
    );
  }

  if (format === "icon") {
    return (
      <span
        aria-label={businessConfig.displayName}
        className={`brand-icon-fallback ${className}`}
        role="img"
      >
        Z
      </span>
    );
  }

  return (
    <span
      aria-label={businessConfig.displayName}
      className={`brand-wordmark ${className}`}
      role="img"
    >
      <span className="brand-wordmark-primary">ZARKA</span>
      <span className="brand-wordmark-secondary">CONSTRUCTION</span>
    </span>
  );
}

