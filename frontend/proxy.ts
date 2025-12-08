import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes - allow access, client will redirect if no token
  if (pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (
    (pathname.startsWith("/login") || pathname.startsWith("/signup")) &&
    token
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
