import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const PROTECTED_PATHS = ["/dashboard", "/api/products", "/api/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!isProtected) return NextResponse.next();

  const token =
    request.cookies.get("shiptrack_session")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value ??
    request.cookies.get("next-auth.session-token")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  const session = await verifyToken(token);
  if (!session) {
    const response =
      pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        : NextResponse.redirect(new URL("/auth/signin", request.url));
    response.cookies.delete("shiptrack_session");
    return response;
  }

  // Inject user ID into request headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", session.id);
  requestHeaders.set("x-user-email", session.email);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/products/:path*",
    "/api/register",
  ],
};
