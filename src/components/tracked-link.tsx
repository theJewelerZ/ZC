"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  eventName?: string;
  eventProperties?: Record<string, string>;
};

export function TrackedLink({
  children,
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      eventName &&
      process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false"
    ) {
      track(eventName, eventProperties);
    }
    onClick?.(event);
  }

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}

