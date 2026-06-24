import { NextRequest, NextResponse } from "next/server";

const BYPASS_SECRET = "quantic2025";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Allow static files, api routes, and the coming-soon page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/admin") ||
    pathname.match(/\.(svg|png|jpg|jpeg|ico|webp|gif|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Allow bypass via ?preview=quantic2025 — sets a cookie for the session
  if (searchParams.get("preview") === BYPASS_SECRET) {
    const res = NextResponse.next();
    res.cookies.set("preview_bypass", BYPASS_SECRET, { path: "/", httpOnly: true, sameSite: "lax" });
    return res;
  }

  // Allow if bypass cookie is set
  if (req.cookies.get("preview_bypass")?.value === BYPASS_SECRET) {
    return NextResponse.next();
  }

  // Everyone else sees coming soon
  return NextResponse.redirect(new URL("/coming-soon", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
