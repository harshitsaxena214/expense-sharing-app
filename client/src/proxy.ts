import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("jwt")?.value;

  const isProtected = pathname.startsWith("/dashboard");
  const isInvite = pathname.startsWith("/invite");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isRoot = pathname === "/";

  if (isInvite) return NextResponse.next();

  // Logged in + auth page → redirect to dashboard directly, no redirectTo loop
  if (token && (isRoot || isAuthPage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Not logged in + protected route → send to login
  if (!token && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
