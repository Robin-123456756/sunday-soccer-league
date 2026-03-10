import type { AppRole } from "@/types/database";

export const PUBLIC_PATH_PREFIXES = [
  "/",
  "/sign-in",
  "/forgot-password",
  "/auth/post-login",
  "/auth/update-password",
  "/auth/accept-invite",
  "/auth/confirm",
  "/auth/error",
];

export const AUTH_EXCLUDED_PREFIXES = [
  "/_next",
  "/api",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

export function getDefaultRouteForRole(role: AppRole) {
  if (role === "team_manager") return "/team-manager/lineups";
  if (role === "referee") return "/referee/assigned-matches";
  return "/dashboard";
}

export function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some((prefix) =>
    prefix === "/" ? pathname === "/" : pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isExcludedFromAuth(pathname: string) {
  return AUTH_EXCLUDED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function routeAllowsRole(pathname: string, role: AppRole) {
  // Admin-only sections
  if (pathname === "/dashboard") return role === "admin";
  if (pathname.startsWith("/admin")) return role === "admin";
  if (pathname.startsWith("/reports")) return role === "admin";
  if (pathname.startsWith("/teams")) return role === "admin";
  if (pathname.startsWith("/players")) return role === "admin";
  if (pathname.startsWith("/referees")) return role === "admin";

  // Role-specific sections
  if (pathname.startsWith("/team-manager")) return role === "team_manager";
  if (pathname.startsWith("/referee")) return role === "referee";

  // Match routes - creating is admin-only, viewing/sub-pages open to all roles
  if (pathname === "/matches/new") return role === "admin";
  if (/^\/matches\/[^/]+\/(edit|lineups|cards|substitutions|referee-report|uploads)$/.test(pathname)) {
    return true;
  }
  if (/^\/matches(\/[^/]+)?$/.test(pathname)) return true;

  // Default: allow (catch-all for any unmatched routes)
  return true;
}
