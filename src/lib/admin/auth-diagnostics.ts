import "server-only";

type AdminAuthStage =
  | "callback_received"
  | "callback_origin_mismatch"
  | "pkce_verifier_missing"
  | "code_exchange_success"
  | "code_exchange_failed"
  | "session_cookie_written"
  | "session_cookie_missing"
  | "user_loaded"
  | "user_missing"
  | "allowlist_match"
  | "allowlist_rejected"
  | "redirecting_admin"
  | "admin_guard_authenticated"
  | "admin_guard_no_session"
  | "password_login_success"
  | "password_login_failed"
  | "password_update_success"
  | "password_update_failed"
  | "recovery_callback_received"
  | "recovery_exchange_success"
  | "recovery_exchange_failed";

type SafeAuthDetails = {
  host?: string;
  reason?: "configuration" | "credentials" | "expired_or_used" | "origin_mismatch" | "mismatch" | "pkce" | "policy" | "provider" | "rate_limit" | "reauthentication" | "same_password" | "session" | "unauthorized" | "weak_password";
};

export function logAdminAuthStage(stage: AdminAuthStage, details: SafeAuthDetails = {}) {
  console.info("admin_auth", { stage, ...details });
}