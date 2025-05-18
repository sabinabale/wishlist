import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/wishlists", "/profile", "/api/wishlists"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value;
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some((route) => path === route);

  if (isProtectedRoute && !userId) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && userId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
    "/api/wishlists/:path*",
  ],
};
