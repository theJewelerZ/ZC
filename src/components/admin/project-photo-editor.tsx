/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

type Props = {
  altText: string;
  caption: string;
  photoId: string;
  projectId: string;
  signedUrl: string | null;
  visibility: "private" | "public";
};

export function ProjectPhotoEditor(props: Props) {
  const [caption, setCaption] = useState(props.caption);
  const [altText, setAltText] = useState(props.altText);
  const [visibility, setVisibility] = useState(props.visibility);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function submit(intent: "save" | "publish" | "unpublish") {
    setBusy(true);
    setStatus(null);
    try {
      const result = await fetch(
        "/api/admin/projects/" + props.projectId + "/photos/" + props.photoId,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ intent, caption, altText }),
        },
      );
      const body = await result.json();
      if (!result.ok) throw new Error(body.message || "The photo could not be updated.");
      setCaption(body.caption);
      setAltText(body.altText);
      setVisibility(body.visibility);
      setStatus({ kind: "success", message: body.message });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "The photo could not be updated." });
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-photo-review">
    {props.signedUrl ? <img alt="Private project preview" src={props.signedUrl} /> : <div className="photo-unavailable">Secure preview unavailable.</div>}
    <label>Caption<input disabled={busy} maxLength={300} onChange={(event) => setCaption(event.target.value)} value={caption} /><small>Visible beneath the photograph.</small></label>
    <label>Alt text<input disabled={busy} maxLength={300} onChange={(event) => setAltText(event.target.value)} value={altText} /><small>Briefly describe what the image shows for screen-reader users.</small></label>
    <div className="admin-photo-actions">
      <button className="button button-outline" disabled={busy} onClick={() => submit("save")} type="button">{busy ? "Working…" : "Save photo details"}</button>
      <button className="button button-primary" disabled={busy} onClick={() => submit(visibility === "public" ? "unpublish" : "publish")} type="button">{visibility === "public" ? "Make private" : "Approve and publish"}</button>
    </div>
    {status ? <p className={status.kind === "error" ? "photo-action-error" : "photo-action-success"} role={status.kind === "error" ? "alert" : "status"}>{status.message}</p> : null}
  </section>;
}
