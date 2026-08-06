export const minimumPasswordLength = 14;
export const maximumPasswordLength = 256;

export type PasswordValidationResult =
  | { success: true }
  | { success: false; message: string };

export function validateAdminPassword(password: string): PasswordValidationResult {
  if (password.length < minimumPasswordLength) {
    return { success: false, message: `Use at least ${minimumPasswordLength} characters.` };
  }
  if (password.length > maximumPasswordLength) {
    return { success: false, message: `Use no more than ${maximumPasswordLength} characters.` };
  }
  if (!/[A-Z]/.test(password)) {
    return { success: false, message: "Include at least one uppercase letter." };
  }
  if (!/[a-z]/.test(password)) {
    return { success: false, message: "Include at least one lowercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { success: false, message: "Include at least one number." };
  }
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    return { success: false, message: "Include at least one symbol." };
  }
  return { success: true };
}
