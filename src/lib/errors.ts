/**
 * Typed error classes for distinguishing auth failures in API routes.
 *
 * UnauthenticatedError  → 401 (no valid session)
 * ForbiddenError        → 403 (signed in but wrong role / not assigned)
 */

export class UnauthenticatedError extends Error {
  readonly code = "UNAUTHENTICATED" as const;
  constructor(message = "You must be signed in.") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export class ForbiddenError extends Error {
  readonly code = "FORBIDDEN" as const;
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Type guard for API route catch blocks. */
export function isUnauthenticated(err: unknown): err is UnauthenticatedError {
  return err instanceof UnauthenticatedError;
}

export function isForbidden(err: unknown): err is ForbiddenError {
  return err instanceof ForbiddenError;
}
