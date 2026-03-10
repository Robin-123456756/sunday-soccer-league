import { describe, it, expect } from "vitest";
import {
  UnauthenticatedError,
  ForbiddenError,
  isUnauthenticated,
  isForbidden,
} from "@/lib/errors";

describe("UnauthenticatedError", () => {
  it("has default message", () => {
    const err = new UnauthenticatedError();
    expect(err.message).toBe("You must be signed in.");
  });

  it("accepts custom message", () => {
    const err = new UnauthenticatedError("Session expired");
    expect(err.message).toBe("Session expired");
  });

  it("has code UNAUTHENTICATED", () => {
    expect(new UnauthenticatedError().code).toBe("UNAUTHENTICATED");
  });

  it("is instanceof Error", () => {
    expect(new UnauthenticatedError()).toBeInstanceOf(Error);
  });
});

describe("ForbiddenError", () => {
  it("has default message", () => {
    const err = new ForbiddenError();
    expect(err.message).toBe("You do not have permission to perform this action.");
  });

  it("accepts custom message", () => {
    const err = new ForbiddenError("Not the assigned referee");
    expect(err.message).toBe("Not the assigned referee");
  });

  it("has code FORBIDDEN", () => {
    expect(new ForbiddenError().code).toBe("FORBIDDEN");
  });

  it("is instanceof Error", () => {
    expect(new ForbiddenError()).toBeInstanceOf(Error);
  });
});

describe("isUnauthenticated", () => {
  it("returns true for UnauthenticatedError", () => {
    expect(isUnauthenticated(new UnauthenticatedError())).toBe(true);
  });

  it("returns false for ForbiddenError", () => {
    expect(isUnauthenticated(new ForbiddenError())).toBe(false);
  });

  it("returns false for generic Error", () => {
    expect(isUnauthenticated(new Error("nope"))).toBe(false);
  });

  it("returns false for non-Error", () => {
    expect(isUnauthenticated("string")).toBe(false);
    expect(isUnauthenticated(null)).toBe(false);
  });
});

describe("isForbidden", () => {
  it("returns true for ForbiddenError", () => {
    expect(isForbidden(new ForbiddenError())).toBe(true);
  });

  it("returns false for UnauthenticatedError", () => {
    expect(isForbidden(new UnauthenticatedError())).toBe(false);
  });

  it("returns false for generic Error", () => {
    expect(isForbidden(new Error("nope"))).toBe(false);
  });
});
