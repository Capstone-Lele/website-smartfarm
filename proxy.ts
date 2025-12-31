import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const cookies = request.cookies.get("session_token");
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!cookies && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginPage && !cookies) {
    return NextResponse.next();
  }

  const session = await decrypt(cookies?.value);

  const isTokenExpired = session && new Date(session.expires_at) < new Date();
  const isAuthenticated = session?.token && !isTokenExpired;

  if (!isAuthenticated) {
    request.cookies.delete("session_token");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login/:path*", "/dashboard/:path*"],
};
