import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();

  // Crear cliente de Supabase en middleware
  const supabase = createMiddlewareClient({ req, res });

  // Recuperar sesión
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Proteger solo rutas que necesitan login
  const protectedRoutes = ["/inspection"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Si no hay sesión → mandar al login
  if (isProtected && !session) {
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// IMPORTANTE: matcher DEBE SER EXACTO así
export const config = {
  matcher: ["/inspection/:path*"],
};