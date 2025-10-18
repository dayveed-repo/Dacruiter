import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "./helpers/supabaseMiddlewareClient";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient(req, res);

  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard & profile routes

  const publicRoutes = ["/login", "/register", "/auth/callback"];

  // If the route is public, skip auth check
  if (
    publicRoutes.some((route) => req.nextUrl.pathname.includes(route)) ||
    req.nextUrl.pathname === "/"
  ) {
    return res;
  }

  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(png|jpg|jpeg|svg|gif|ico)).*)",
  ], // Pages to protect
};
