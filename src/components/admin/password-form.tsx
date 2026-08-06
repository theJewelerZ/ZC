"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { maximumPasswordLength, minimumPasswordLength, validateAdminPassword } from "@/lib/admin/password-policy";

export function AdminPasswordForm({ mode }: { mode: "set" | "reset" }) {
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [field, setField] = useState<"password" | "confirmation" | null>(null);
  const [complete, setComplete] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message) errorRef.current?.focus();
  }, [message]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setField(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmation") || "");
    if (password !== confirmation) {
      setField("confirmation");
      setMessage("The passwords do not match.");
      return;
    }
    const validation = validateAdminPassword(password);
    if (!validation.success) {
      setField("password");
      setMessage(validation.message);
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/admin/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, password, confirmation }),
      });
      const result = await response.json() as { ok?: boolean; message?: string; field?: "password" | "confirmation"; redirectTo?: string };
      if (!response.ok || !result.ok) {
        setMessage(result.message || "The password could not be updated.");
        setField(result.field || null);
        return;
      }
      if (mode === "reset") {
        setComplete(true);
        return;
      }
      window.location.assign(result.redirectTo === "/admin" ? result.redirectTo : "/admin");
    } catch {
      setMessage("The password could not be updated. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  if (complete) {
    return <div className="form-success-summary admin-password-success" role="status">
      <h2>Password updated</h2>
      <p>Your new password is ready. Continue to sign in to the founder dashboard.</p>
      <Link className="button button-primary" href="/admin/login?password=reset">Continue to sign in</Link>
    </div>;
  }

  return <form className="admin-login-form" onSubmit={submit}>
    {message ? <div aria-live="assertive" className="form-error-summary" ref={errorRef} role="alert" tabIndex={-1}>{message}</div> : null}
    <p className="admin-form-note" id="password-requirements">Use a password manager to generate and store a unique password. It must be at least {minimumPasswordLength} characters with uppercase, lowercase, a number, and a symbol.</p>
    <label htmlFor="new-password">New password</label>
    <div className="password-input-wrap">
      <input aria-describedby="password-requirements" aria-invalid={field === "password" || undefined} autoComplete="new-password" id="new-password" maxLength={maximumPasswordLength} minLength={minimumPasswordLength} name="password" required type={showPassword ? "text" : "password"} />
      <button aria-controls="new-password confirm-password" aria-pressed={showPassword} className="password-toggle" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? "Hide" : "Show"}</button>
    </div>
    <label htmlFor="confirm-password">Confirm new password</label>
    <input aria-invalid={field === "confirmation" || undefined} autoComplete="new-password" id="confirm-password" maxLength={maximumPasswordLength} minLength={minimumPasswordLength} name="confirmation" required type={showPassword ? "text" : "password"} />
    <button className="button button-primary" disabled={pending} type="submit">{pending ? "Updating…" : mode === "reset" ? "Reset password" : "Set password"}</button>
  </form>;
}
