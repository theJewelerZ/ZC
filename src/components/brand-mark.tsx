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
  const iconAsset =
    surface === "dark"
      ? businessConfig.logo.iconOnDark
      : businessConfig.logo.iconOnLight;
  const horizontalAsset =
    surface === "dark"
      ? businessConfig.logo.horizontalOnDark
      : businessConfig.logo.horizontalOnLight;
  const asset = format === "icon" ? iconAsset : horizontalAsset;

  if (asset) {
    return (
      <Image
        alt={businessConfig.displayName}
        className={className}
        height={format === "icon" ? 781 : 56}
        priority
        sizes={
          format === "icon"
            ? "(max-width: 600px) calc(100vw - 40px), (max-width: 960px) 560px, 470px"
            : "220px"
        }
        src={asset}
        width={format === "icon" ? 615 : 220}
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
      className={`brand-lockup ${className}`}
      role="img"
    >
      {iconAsset ? (
        <Image
          alt=""
          className="brand-lockup-mark"
          height={781}
          priority
          sizes="48px"
          src={iconAsset}
          width={615}
        />
      ) : null}
      <span className="brand-wordmark">
        <span className="brand-wordmark-primary">ZARKA</span>
        <span className="brand-wordmark-secondary">CONSTRUCTION</span>
      </span>
    </span>
  );
}
