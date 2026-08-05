"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm({ url, publishableKey }: { url: string; publishableKey: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    setState("sending");
    const client = createSupabaseBrowserClient(url, publishableKey);
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback`, shouldCreateUser: false },
    });
    if (error) {
      setState("error");
      setMessage("A sign-in link could not be sent. Confirm the founder account and try again.");
      return;
    }
    setState("sent");
    setMessage("If this email belongs to the authorized founder account, a sign-in link is on its way.");
  }
  return <form className="admin-login-form" onSubmit={submit}>
    <label htmlFor="admin-email">Founder email</label>
    <input autoComplete="email" id="admin-email" name="email" required type="email" />
    <button className="button button-primary" disabled={state === "sending" || state === "sent"} type="submit">{state === "sending" ? "Sending link…" : state === "sent" ? "Link sent" : "Send secure sign-in link"}</button>
    {message ? <p aria-live="polite" className={state === "error" ? "field-error" : ""}>{message}</p> : null}
  </form>;
}
