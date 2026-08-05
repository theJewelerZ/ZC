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
  | "admin_guard_no_session";

type SafeAuthDetails = {
  host?: string;
  reason?: "configuration" | "expired_or_used" | "origin_mismatch" | "pkce" | "session" | "unauthorized";
};

export function logAdminAuthStage(stage: AdminAuthStage, details: SafeAuthDetails = {}) {
  console.info("admin_auth", { stage, ...details });
}
