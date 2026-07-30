// Edge-safe auth helpers for the private tracker area.
// A single shared password gates the area. We never store the password in the
// cookie — instead the cookie holds a SHA-256 token derived from the password
// plus a server secret, which the middleware recomputes and compares.

export const COOKIE_NAME = "aqui_tracker";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  // Web Crypto is available in both the Edge runtime (middleware) and Node 18+.
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * The session token expected in the cookie. Returns null when the tracker is
 * not configured (missing env vars) so the middleware fails closed.
 */
export async function computeToken(): Promise<string | null> {
  const pw = process.env.TRACKER_PASSWORD;
  const secret = process.env.TRACKER_SECRET;
  if (!pw || !secret) return null;
  return sha256Hex(`${pw}:${secret}:aqui-tracker-v1`);
}

/** Constant-time-ish string comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
