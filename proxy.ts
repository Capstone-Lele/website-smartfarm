import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // const res = NextResponse.next();
  // res.cookies.set('proxy-cookie', 'rahasia', { httpOnly: true, secure: true, path: '/', maxAge: 60 * 60 * 24 });
  // return res;

  const cookies = request.cookies.get("session_token");

  // const expirationTime = new Date(cookies?.expires || 0).getTime();

  if (cookies?.value) {
    if (request.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
