"use client";

import { useEffect, useState } from "react";

export function SaveBuildToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);

    const timeout = window.setTimeout(() => setVisible(false), 6000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="admin-inline-save-toast"
      role="status"
    >
      <span>
        <strong>Build saved.</strong>
        <small>Project data is up to date.</small>
      </span>
      <button
        aria-label="Dismiss save confirmation"
        onClick={() => setVisible(false)}
        type="button"
      >
        Close
      </button>
    </div>
  );
}