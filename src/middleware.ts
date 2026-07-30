import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, computeToken, safeEqual } from "@/lib/tracker/auth";

// Protect the private tracker area and its data API behind the password cookie.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page and its API must stay reachable while logged out.
  if (pathname.startsWith("/tracker/login") || pathname.startsWith("/api/login")) {
    return NextResponse.next();
  }

  const expected = await computeToken();
  const got = req.cookies.get(COOKIE_NAME)?.value ?? "";
  const authed = !!expected && safeEqual(got, expected);

  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/tracker/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/tracker/:path*", "/api/progress/:path*"],
};
