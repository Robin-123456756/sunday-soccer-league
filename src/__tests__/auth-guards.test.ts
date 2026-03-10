import { describe, it, expect, vi, beforeEach } from "vitest";
import { UnauthenticatedError, ForbiddenError } from "@/lib/errors";

/*
 * We mock the Supabase client and next/cache so the auth guard functions
 * can be tested in isolation — no real DB calls.
 */

// Chainable query builder mock
function chainable(terminal: Record<string, unknown> = {}) {
  const obj: Record<string, unknown> = {};
  const handler: ProxyHandler<Record<string, unknown>> = {
    get(_target, prop: string) {
      if (prop in terminal) return terminal[prop];
      return () => new Proxy({}, handler);
    },
  };
  return new Proxy(obj, handler);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockGetUser: (...args: any[]) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockFrom: (...args: any[]) => any;

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    auth: { getUser: (...args: unknown[]) => mockGetUser(...args) },
    from: (...args: unknown[]) => mockFrom(...args),
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Helper to build a "from" mock that responds to table queries
function buildFromMock(tables: Record<string, unknown>) {
  return vi.fn((table: string) => {
    const value = tables[table];
    // value is what .single() / .maybeSingle() should resolve to
    return chainable({
      single: () => Promise.resolve(value ?? { data: null, error: { message: "not found" } }),
      maybeSingle: () => Promise.resolve(value ?? { data: null, error: null }),
    });
  });
}

// We import *after* mocks are set up
const authModule = await import("@/server/queries/auth");

beforeEach(() => {
  vi.clearAllMocks();
});

/* ── getCurrentUserProfile ── */

describe("getCurrentUserProfile", () => {
  it("throws UnauthenticatedError when no session", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    mockFrom = buildFromMock({});

    await expect(authModule.getCurrentUserProfile()).rejects.toThrow(UnauthenticatedError);
  });

  it("throws UnauthenticatedError when no profile row", async () => {
    mockGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockFrom = buildFromMock({
      users_profile: { data: null, error: { message: "not found" } },
    });

    await expect(authModule.getCurrentUserProfile()).rejects.toThrow(UnauthenticatedError);
  });

  it("returns profile when authenticated", async () => {
    const profile = { id: "user-1", full_name: "Admin", email: "a@b.com", role: "admin", team_id: null, is_active: true };
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    mockFrom = buildFromMock({
      users_profile: { data: profile, error: null },
    });

    const result = await authModule.getCurrentUserProfile();
    expect(result).toEqual(profile);
  });
});

/* ── requireRole ── */

describe("requireRole", () => {
  const adminProfile = { id: "user-1", full_name: "Admin", email: "a@b.com", role: "admin", team_id: null, is_active: true };
  const refereeProfile = { id: "user-2", full_name: "Ref", email: "r@b.com", role: "referee", team_id: null, is_active: true };

  it("passes for allowed role", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    mockFrom = buildFromMock({ users_profile: { data: adminProfile, error: null } });

    const result = await authModule.requireRole(["admin"]);
    expect(result.role).toBe("admin");
  });

  it("throws ForbiddenError for disallowed role", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "user-2" } }, error: null });
    mockFrom = buildFromMock({ users_profile: { data: refereeProfile, error: null } });

    await expect(authModule.requireRole(["admin"])).rejects.toThrow(ForbiddenError);
  });

  it("throws UnauthenticatedError when not signed in", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    mockFrom = buildFromMock({});

    await expect(authModule.requireRole(["admin"])).rejects.toThrow(UnauthenticatedError);
  });
});

/* ── requireMatchRole ── */

describe("requireMatchRole", () => {
  const adminProfile = { id: "admin-1", full_name: "Admin", email: "admin@test.com", role: "admin", team_id: null, is_active: true };
  const refereeProfile = { id: "ref-1", full_name: "Ref", email: "ref@test.com", role: "referee", team_id: null, is_active: true };
  const managerProfile = { id: "mgr-1", full_name: "Mgr", email: "mgr@test.com", role: "team_manager", team_id: "t1", is_active: true };

  it("admin passes through without referee check", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "admin-1" } }, error: null });
    // from() is called for users_profile only — admin never queries matches/referees
    mockFrom = vi.fn((table: string) => {
      return chainable({
        single: () => {
          if (table === "users_profile") return Promise.resolve({ data: adminProfile, error: null });
          // Should not reach here for admin
          return Promise.resolve({ data: null, error: null });
        },
      });
    });

    const result = await authModule.requireMatchRole("match-1");
    expect(result.role).toBe("admin");
    // Admin should NOT query matches or referees tables
    const tablesQueried = (mockFrom as ReturnType<typeof vi.fn>).mock.calls.map((c: unknown[]) => c[0]);
    expect(tablesQueried).toContain("users_profile");
    expect(tablesQueried).not.toContain("matches");
  });

  it("referee matched by user_id passes", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "ref-1" } }, error: null });
    mockFrom = vi.fn((table: string) =>
      chainable({
        single: () => {
          if (table === "users_profile") return Promise.resolve({ data: refereeProfile, error: null });
          if (table === "matches") return Promise.resolve({ data: { id: "match-1", referee_id: "referee-rec-1", home_team_id: "t1", away_team_id: "t2" }, error: null });
          if (table === "referees") return Promise.resolve({ data: { id: "referee-rec-1", user_id: "ref-1", email: "ref@test.com" }, error: null });
          return Promise.resolve({ data: null, error: null });
        },
      })
    );

    const result = await authModule.requireMatchRole("match-1");
    expect(result.role).toBe("referee");
  });

  it("referee matched by email fallback passes", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "ref-1" } }, error: null });
    mockFrom = vi.fn((table: string) =>
      chainable({
        single: () => {
          if (table === "users_profile") return Promise.resolve({ data: refereeProfile, error: null });
          if (table === "matches") return Promise.resolve({ data: { id: "match-1", referee_id: "referee-rec-1", home_team_id: "t1", away_team_id: "t2" }, error: null });
          // user_id is null — triggers email fallback
          if (table === "referees") return Promise.resolve({ data: { id: "referee-rec-1", user_id: null, email: "REF@test.com" }, error: null });
          return Promise.resolve({ data: null, error: null });
        },
      })
    );

    const result = await authModule.requireMatchRole("match-1");
    expect(result.role).toBe("referee");
  });

  it("throws ForbiddenError for wrong referee", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "ref-1" } }, error: null });
    mockFrom = vi.fn((table: string) =>
      chainable({
        single: () => {
          if (table === "users_profile") return Promise.resolve({ data: refereeProfile, error: null });
          if (table === "matches") return Promise.resolve({ data: { id: "match-1", referee_id: "referee-rec-99", home_team_id: "t1", away_team_id: "t2" }, error: null });
          if (table === "referees") return Promise.resolve({ data: { id: "referee-rec-99", user_id: "other-user", email: "other@test.com" }, error: null });
          return Promise.resolve({ data: null, error: null });
        },
      })
    );

    await expect(authModule.requireMatchRole("match-1")).rejects.toThrow(ForbiddenError);
  });

  it("throws Error for match with no referee assigned", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "ref-1" } }, error: null });
    mockFrom = vi.fn((table: string) =>
      chainable({
        single: () => {
          if (table === "users_profile") return Promise.resolve({ data: refereeProfile, error: null });
          if (table === "matches") return Promise.resolve({ data: { id: "match-1", referee_id: null, home_team_id: "t1", away_team_id: "t2" }, error: null });
          return Promise.resolve({ data: null, error: null });
        },
      })
    );

    await expect(authModule.requireMatchRole("match-1")).rejects.toThrow("This match has no referee assigned.");
  });

  it("throws ForbiddenError for team_manager role", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "mgr-1" } }, error: null });
    mockFrom = vi.fn((table: string) =>
      chainable({
        single: () => {
          if (table === "users_profile") return Promise.resolve({ data: managerProfile, error: null });
          return Promise.resolve({ data: null, error: null });
        },
      })
    );

    await expect(authModule.requireMatchRole("match-1")).rejects.toThrow(ForbiddenError);
  });

  it("throws Error for non-existent match", async () => {
    mockGetUser = vi.fn().mockResolvedValue({ data: { user: { id: "ref-1" } }, error: null });
    mockFrom = vi.fn((table: string) =>
      chainable({
        single: () => {
          if (table === "users_profile") return Promise.resolve({ data: refereeProfile, error: null });
          if (table === "matches") return Promise.resolve({ data: null, error: { message: "not found" } });
          return Promise.resolve({ data: null, error: null });
        },
      })
    );

    await expect(authModule.requireMatchRole("nonexistent")).rejects.toThrow("Match not found.");
  });
});
