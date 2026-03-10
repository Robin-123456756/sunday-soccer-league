import { NextResponse } from "next/server";
import { isUnauthenticated, isForbidden } from "@/lib/errors";

/**
 * Converts an auth error into the correct JSON response:
 *   UnauthenticatedError → 401  { error: "Unauthorized", code: "UNAUTHENTICATED" }
 *   ForbiddenError       → 403  { error: "Forbidden",    code: "FORBIDDEN" }
 *   anything else        → 401  (safe default for unknown auth errors)
 */
export function authErrorResponse(err: unknown) {
  if (isForbidden(err)) {
    return NextResponse.json(
      { error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 }
    );
  }
  if (isUnauthenticated(err)) {
    return NextResponse.json(
      { error: "Unauthorized", code: "UNAUTHENTICATED" },
      { status: 401 }
    );
  }
  // Unknown auth error — treat as unauthenticated
  return NextResponse.json(
    { error: "Unauthorized", code: "UNAUTHENTICATED" },
    { status: 401 }
  );
}

/**
 * Standard 500 response with a traceable error code.
 * Logs a sanitized summary to stderr so production failures are diagnosable.
 */
export function internalErrorResponse(err?: unknown) {
  if (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    const name = err instanceof Error ? err.name : typeof err;
    console.error(
      JSON.stringify({
        level: "error",
        code: "INTERNAL_ERROR",
        name,
        message,
        timestamp: new Date().toISOString(),
      })
    );
  }
  return NextResponse.json(
    { error: "Internal server error", code: "INTERNAL_ERROR" },
    { status: 500 }
  );
}
