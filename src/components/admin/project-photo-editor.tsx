/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

type MilestoneOption = { id: string; title: string; occurredOn: string };

type Props = {
  altText: string;
  candidate: boolean;
  caption: string;
  coverSelected: boolean;
  milestones: MilestoneOption[];
  photoId: string;
  projectId: string;
  selectedMilestoneId: string | null;
  signedUrl: string | null;
  socialSelected: boolean;
  sortOrder: number;
  visibility: "private" | "public";
};

type Intent = "save" | "publish" | "unpublish" | "set-cover" | "set-social";

export function ProjectPhotoEditor(props: Props) {
  const [caption, setCaption] = useState(props.caption);
  const [altText, setAltText] = useState(props.altText);
  const [updateId, setUpdateId] = useState(props.selectedMilestoneId || "");
  const [sortOrder, setSortOrder] = useState(props.sortOrder);
  const [visibility, setVisibility] = useState(props.visibility);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function submit(intent: Intent) {
    setBusy(true);
    setStatus(null);
    try {
      const result = await fetch(
        `/api/admin/projects/${props.projectId}/photos/${props.photoId}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            intent,
            caption,
            altText,
            updateId: updateId || null,
            sortOrder,
          }),
        },
      );
      const body = await result.json();
      if (!result.ok) throw new Error(body.message || "The photo could not be updated.");
      if (typeof body.caption === "string") setCaption(body.caption);
      if (typeof body.altText === "string") setAltText(body.altText);
      if (typeof body.updateId === "string" || body.updateId === null) setUpdateId(body.updateId || "");
      if (typeof body.sortOrder === "number") setSortOrder(body.sortOrder);
      if (body.visibility) setVisibility(body.visibility);
      setStatus({ kind: "success", message: body.message });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "The photo could not be updated." });
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-photo-review" id={`photo-${props.photoId}`}>
    <div className="admin-photo-preview">
      {props.candidate ? <span className="field-candidate-badge">Public candidate — review required</span> : null}
      {props.coverSelected ? <span className="admin-editorial-badge">Cover image</span> : null}
      {props.socialSelected ? <span className="admin-editorial-badge">Social preview</span> : null}
      {props.signedUrl ? <img alt="Private project preview" src={props.signedUrl} /> : <div className="photo-unavailable">Secure preview unavailable.</div>}
    </div>
    <div className="admin-photo-fields">
      <label>Customer-facing caption
        <textarea disabled={busy} maxLength={300} onChange={(event) => setCaption(event.target.value)} rows={3} value={caption} />
        <small>Explain what a future customer should notice and why it matters.</small>
      </label>
      <label>Descriptive alt text
        <textarea disabled={busy} maxLength={300} onChange={(event) => setAltText(event.target.value)} rows={2} value={altText} />
        <small>Describe what is visible without repeating the caption.</small>
      </label>
      <label>Editorial milestone
        <select disabled={busy} onChange={(event) => setUpdateId(event.target.value)} value={updateId}>
          <option value="">Project details / unassigned</option>
          {props.milestones.map((milestone) => <option key={milestone.id} value={milestone.id}>{milestone.occurredOn} — {milestone.title}</option>)}
        </select>
      </label>
      <label>Photo order
        <input disabled={busy} min={0} onChange={(event) => setSortOrder(Number(event.target.value) || 0)} type="number" value={sortOrder} />
      </label>
    </div>
    <div className="admin-photo-actions">
      <button className="button button-outline" disabled={busy} onClick={() => submit("save")} type="button">{busy ? "Working…" : "Save photo details"}</button>
      <button className="button button-primary" disabled={busy} onClick={() => submit(visibility === "public" ? "unpublish" : "publish")} type="button">{visibility === "public" ? "Make private" : "Publish sanitized copy"}</button>
      {visibility === "public" ? <>
        <button className="button button-outline" disabled={busy || props.coverSelected} onClick={() => submit("set-cover")} type="button">{props.coverSelected ? "Current cover" : "Use as cover"}</button>
        <button className="button button-outline" disabled={busy || props.socialSelected} onClick={() => submit("set-social")} type="button">{props.socialSelected ? "Current social image" : "Use for social preview"}</button>
      </> : null}
    </div>
    {status ? <p className={status.kind === "error" ? "photo-action-error" : "photo-action-success"} role={status.kind === "error" ? "alert" : "status"}>{status.message}</p> : null}
  </section>;
}
