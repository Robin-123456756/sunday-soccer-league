import { describe, it, expect, vi } from "vitest";
import { UnauthenticatedError, ForbiddenError } from "@/lib/errors";
import { authErrorResponse, internalErrorResponse } from "@/lib/api-error";

describe("authErrorResponse", () => {
  it("returns 401 for UnauthenticatedError", async () => {
    const res = authErrorResponse(new UnauthenticatedError());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
    expect(body.code).toBe("UNAUTHENTICATED");
  });

  it("returns 403 for ForbiddenError", async () => {
    const res = authErrorResponse(new ForbiddenError());
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Forbidden");
    expect(body.code).toBe("FORBIDDEN");
  });

  it("returns 401 for unknown error (safe default)", async () => {
    const res = authErrorResponse(new Error("something weird"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.code).toBe("UNAUTHENTICATED");
  });
});

describe("internalErrorResponse", () => {
  it("returns 500 with INTERNAL_ERROR code", async () => {
    const res = internalErrorResponse();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Internal server error");
    expect(body.code).toBe("INTERNAL_ERROR");
  });

  it("returns 500 when called with an error argument", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = internalErrorResponse(new TypeError("db connection lost"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.code).toBe("INTERNAL_ERROR");

    expect(spy).toHaveBeenCalledOnce();
    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.level).toBe("error");
    expect(logged.name).toBe("TypeError");
    expect(logged.message).toBe("db connection lost");
    expect(logged.timestamp).toBeDefined();
    spy.mockRestore();
  });

  it("logs unknown non-Error values safely", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = internalErrorResponse("string-crash");
    expect(res.status).toBe(500);

    const logged = JSON.parse(spy.mock.calls[0][0] as string);
    expect(logged.name).toBe("string");
    expect(logged.message).toBe("Unknown error");
    spy.mockRestore();
  });
});
