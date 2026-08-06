"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ForgotPasswordForm({ recoveryUrl, url, publishableKey }: { recoveryUrl: string; url: string; publishableKey: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const email = String(new FormData(event.currentTarget).get("email") || "").trim().toLowerCase();
    try {
      const preflight = await fetch("/api/admin/auth/recovery-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!preflight.ok) {
        const result = await preflight.json() as { message?: string };
        setState("error");
        setMessage(result.message || "Recovery could not be requested. Try again later.");
        return;
      }
      const client = createSupabaseBrowserClient(url, publishableKey);
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: recoveryUrl });
      if (error) {
        setState("error");
        setMessage(error.code === "over_email_send_rate_limit" || error.code === "over_request_rate_limit"
          ? "Supabase has temporarily limited recovery emails. Wait before requesting another email, then use only the newest link."
          : "A recovery email could not be sent right now. Wait a few minutes and try again.");
        return;
      }
      setState("sent");
      setMessage("If this email belongs to the authorized founder account, password recovery instructions are on the way. Open only the newest email in this browser and device.");
    } catch {
      setState("error");
      setMessage("Recovery could not be requested. Check your connection and try again.");
    }
  }

  return <form className="admin-login-form" onSubmit={submit}>
    <label htmlFor="recovery-email">Email</label>
    <input autoComplete="email" id="recovery-email" name="email" required type="email" />
    <button className="button button-primary" disabled={state === "sending" || state === "sent"} type="submit">{state === "sending" ? "Requesting…" : state === "sent" ? "Email requested" : "Send recovery email"}</button>
    {message ? <div aria-live="polite" className={state === "error" ? "form-error-summary" : "admin-form-note"} role={state === "error" ? "alert" : "status"}>{message}</div> : null}
  </form>;
}
