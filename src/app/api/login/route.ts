import { NextResponse } from "next/server";
import { COOKIE_NAME, COOKIE_MAX_AGE, computeToken } from "@/lib/tracker/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.TRACKER_PASSWORD || !process.env.TRACKER_SECRET) {
    return NextResponse.json(
      { error: "Tracker is not configured (missing TRACKER_PASSWORD / TRACKER_SECRET)." },
      { status: 500 }
    );
  }

  let password = "";
  try {
    const body = await req.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    // ignore malformed body
  }

  if (password !== process.env.TRACKER_PASSWORD) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await computeToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}

// Logout: clear the cookie.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
