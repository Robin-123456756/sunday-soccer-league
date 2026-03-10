import { describe, it, expect } from "vitest";
import { getFlashFromCode, AUTH_FLASHES } from "@/lib/auth/flash";

describe("getFlashFromCode", () => {
  it("returns null for null/undefined/empty", () => {
    expect(getFlashFromCode(null)).toBeNull();
    expect(getFlashFromCode(undefined)).toBeNull();
    expect(getFlashFromCode("")).toBeNull();
  });

  it("returns null for unknown code", () => {
    expect(getFlashFromCode("nonexistent_code")).toBeNull();
  });

  it("returns correct config for each known code", () => {
    const knownCodes = Object.keys(AUTH_FLASHES);
    expect(knownCodes.length).toBeGreaterThan(0);

    for (const code of knownCodes) {
      const result = getFlashFromCode(code);
      expect(result).not.toBeNull();
      expect(result!.title).toBeTruthy();
      expect(result!.message).toBeTruthy();
      expect(["success", "error", "info"]).toContain(result!.tone);
    }
  });

  it("returns success tone for invite_verified", () => {
    expect(getFlashFromCode("invite_verified")!.tone).toBe("success");
  });

  it("returns error tone for expired_link", () => {
    expect(getFlashFromCode("expired_link")!.tone).toBe("error");
  });

  it("returns info tone for signed_out", () => {
    expect(getFlashFromCode("signed_out")!.tone).toBe("info");
  });
});
