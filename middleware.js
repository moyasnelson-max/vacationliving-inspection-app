import { NextResponse } from "next/server";

const SUPPORTED_LANGS = ["en", "es"];
const DEFAULT_LANG = "en";

function getPreferredLang(request) {
  const cookieLang = request.cookies.get("lang")?.value;
  if (SUPPORTED_LANGS.includes(cookieLang)) return cookieLang;

  const header = request.headers.get("accept-language");
  if (!header) return DEFAULT_LANG;

  const lang = header.split(",")[0].split("-")[0];
  return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ignore static files and api
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLang = SUPPORTED_LANGS.some(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );

  if (hasLang) {
    const response = NextResponse.next();
    const lang = pathname.split("/")[1];
    response.cookies.set("lang", lang, { path: "/" });
    return response;
  }

  const lang = getPreferredLang(request);
  const redirectUrl = new URL(`/${lang}${pathname}`, request.url);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
