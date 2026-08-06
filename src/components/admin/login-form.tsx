"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(form.get("email") || "").trim(),
          password: String(form.get("password") || ""),
        }),
      });
      const result = await response.json() as { ok?: boolean; message?: string; redirectTo?: string };
      if (!response.ok || !result.ok) {
        setMessage(result.message || "Email or password is incorrect.");
        return;
      }
      window.location.assign(result.redirectTo === "/admin" ? result.redirectTo : "/admin");
    } catch {
      setMessage("Sign-in could not be completed. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return <form className="admin-login-form" onSubmit={submit}>
    <label htmlFor="admin-email">Email</label>
    <input autoComplete="username" id="admin-email" name="email" required type="email" />
    <label htmlFor="admin-password">Password</label>
    <div className="password-input-wrap">
      <input autoComplete="current-password" id="admin-password" name="password" required type={showPassword ? "text" : "password"} />
      <button aria-controls="admin-password" aria-pressed={showPassword} className="password-toggle" onClick={() => setShowPassword((value) => !value)} type="button">{showPassword ? "Hide" : "Show"}</button>
    </div>
    <button className="button button-primary" disabled={pending} type="submit">{pending ? "Signing in…" : "Sign in"}</button>
    <Link className="admin-text-link" href="/admin/forgot-password">Forgot password?</Link>
    {message ? <div aria-live="polite" className="form-error-summary" role="alert">{message}</div> : null}
  </form>;
}