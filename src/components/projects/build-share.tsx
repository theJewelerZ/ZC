"use client";

import { useId, useState } from "react";

import type { PublicBuildShareData } from "@/lib/projects/share";
import {
  copyBuildLink,
  shareBuild as shareBuildWithEnvironment,
  type BuildShareEnvironment,
  type BuildShareOutcome,
} from "@/lib/projects/share-client";

type ShareState = "idle" | BuildShareOutcome;

function getBrowserEnvironment(): BuildShareEnvironment {
  const clipboard = navigator.clipboard;
  return {
    share: navigator.share ? navigator.share.bind(navigator) : undefined,
    copy: clipboard ? clipboard.writeText.bind(clipboard) : undefined,
    clipboardAvailable: window.isSecureContext && Boolean(clipboard),
  };
}

export function BuildShare({
  data,
  presentation = "detail",
}: {
  data: PublicBuildShareData;
  presentation?: "card" | "detail";
}) {
  const [shareState, setShareState] = useState<ShareState>("idle");
  const statusId = useId();

  async function copyLink() {
    setShareState(await copyBuildLink(data.canonicalUrl, getBrowserEnvironment()));
  }

  async function shareCurrentBuild() {
    setShareState("idle");
    setShareState(await shareBuildWithEnvironment(data, getBrowserEnvironment()));
  }

  return (
    <div className={`build-share build-share-${presentation}`} data-state={shareState}>
      <div className="build-share-actions">
        <button aria-describedby={statusId} className="build-share-action" onClick={shareCurrentBuild} type="button">
          Share
        </button>
        {presentation === "detail" ? (
          <>
            <button aria-describedby={statusId} className="build-share-action" onClick={copyLink} type="button">
              Copy Link
            </button>
            <a className="build-share-action" href={data.xIntentUrl} rel="noopener noreferrer" target="_blank">
              Post to X<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </>
        ) : null}
      </div>
      <p aria-live="polite" className="build-share-status" id={statusId}>
        {shareState === "shared" ? "Build shared." : shareState === "copied" ? "Build link copied." : shareState === "manual" ? "Copy this Build link manually." : ""}
      </p>
      {shareState === "manual" ? (
        <label className="build-share-manual">
          <span>Build link</span>
          <input
            onFocus={(event) => event.currentTarget.select()}
            readOnly
            type="url"
            value={data.canonicalUrl}
          />
        </label>
      ) : null}
    </div>
  );
}
