import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔓 Public routes (bez auth)
  const publicPaths = ["/", "/api/auth", "/site/login"];

  if (
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/games") // ✅ NIE blokujemy dynamicznych stron
  ) {
    return NextResponse.next();
  }

  // 🔐 Pobranie tokena
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ❌ brak logowania → redirect
  if (!token) {
    const url = new URL("/site/login", req.url);
    return NextResponse.redirect(url);
  }

  // ❌ użytkownik niezaakceptowany
  if (!token.isApproved) {
    const url = new URL("/pending", req.url);
    return NextResponse.redirect(url);
  }

  // 🔒 admin routes
  if (pathname.startsWith("/admin")) {
    if (token.role !== "ADMIN") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Matcher (bez zmian – globalny, ale logika wewnątrz filtruje)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};