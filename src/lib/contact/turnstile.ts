type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstile(
  token: string,
  secret: string,
  remoteAddress?: string,
) {
  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteAddress) {
    body.set("remoteip", remoteAddress);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8_000),
    },
  );

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as TurnstileResponse;
  return result.success;
}

