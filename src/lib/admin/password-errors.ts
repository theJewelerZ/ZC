export type PasswordUpdateFailureReason =
  | "weak_password"
  | "same_password"
  | "reauthentication"
  | "rate_limit"
  | "provider";

export function classifyPasswordUpdateError(error: { code?: string | null }) {
  switch (error.code) {
    case "weak_password":
      return {
        reason: "weak_password" as const,
        message: "Supabase rejected this password under the active security rules. Use a new password-manager-generated password with at least 14 characters, uppercase, lowercase, a number, and a symbol.",
      };
    case "same_password":
      return {
        reason: "same_password" as const,
        message: "Choose a password different from the current password.",
      };
    case "reauthentication_needed":
    case "session_expired":
    case "session_not_found":
      return {
        reason: "reauthentication" as const,
        message: "Your secure recovery session expired. Request a new recovery email and try again.",
      };
    case "over_request_rate_limit":
      return {
        reason: "rate_limit" as const,
        message: "Too many password requests were made. Wait a few minutes and try again.",
      };
    default:
      return {
        reason: "provider" as const,
        message: "The password could not be updated. Request a new recovery email and try again with a password-manager-generated password.",
      };
  }
}
