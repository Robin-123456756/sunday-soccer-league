import { describe, it, expect, vi, beforeEach } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/lib/errors";

/**
 * Tests that server actions (cards, substitutions, referee reports,
 * score updates) correctly enforce role and match-level authorization.
 *
 * Strategy: mock requireMatchRole / requireRole so we never hit a real DB,
 * then assert the action rejects or proceeds based on the mock.
 */

// ── Shared mocks ──

// Suppress revalidatePath (called on success paths)
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// Default: createServerSupabaseClient returns a stub that succeeds on insert/upsert/update/select
function supabaseStub(overrides: Record<string, unknown> = {}) {
  return {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => Promise.resolve({ data: { id: "new-1" }, error: null })) })), error: null, data: null, ...Promise.resolve({ error: null }) })),
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ error: null })) })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { referee_id: "ref-1", home_team_id: "t1", away_team_id: "t2" }, error: null })),
        })),
      })),
      ...overrides,
    })),
  };
}

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(async () => supabaseStub()),
}));

// ── Auth module mock ──
// We dynamically control what requireMatchRole / requireRole do per test.
const mockRequireMatchRole = vi.fn();
const mockRequireRole = vi.fn();
const mockValidateTeamInMatch = vi.fn().mockResolvedValue(undefined);
const mockValidatePlayerInTeam = vi.fn().mockResolvedValue(undefined);

vi.mock("@/server/queries/auth", () => ({
  requireMatchRole: (...args: unknown[]) => mockRequireMatchRole(...args),
  requireRole: (...args: unknown[]) => mockRequireRole(...args),
  validateTeamInMatch: (...args: unknown[]) => mockValidateTeamInMatch(...args),
  validatePlayerInTeam: (...args: unknown[]) => mockValidatePlayerInTeam(...args),
}));

// Validation mocks — let them pass by default
vi.mock("@/lib/validation", () => ({
  validateCardType: vi.fn(() => null),
  validateActionMinute: vi.fn(() => null),
  validateDifferentPlayers: vi.fn(() => null),
  validateScore: vi.fn(() => null),
}));

// Import actions after mocks
const { recordCardEvent } = await import("@/server/actions/cards");
const { recordSubstitution } = await import("@/server/actions/substitutions");
const { submitRefereeReport } = await import("@/server/actions/referee-reports");
const { updateMatchScore, createMatch } = await import("@/server/actions/matches");

const adminProfile = { id: "admin-1", full_name: "Admin", email: "a@test.com", role: "admin", team_id: null, is_active: true };
const refereeProfile = { id: "ref-1", full_name: "Ref", email: "r@test.com", role: "referee", team_id: null, is_active: true };

beforeEach(() => {
  vi.clearAllMocks();
  // Default: auth passes as admin
  mockRequireMatchRole.mockResolvedValue(adminProfile);
  mockRequireRole.mockResolvedValue(adminProfile);
  mockValidateTeamInMatch.mockResolvedValue(undefined);
  mockValidatePlayerInTeam.mockResolvedValue(undefined);
});

/* ── recordCardEvent ── */

describe("recordCardEvent authz", () => {
  const validCard = {
    matchId: "m1",
    teamId: "t1",
    playerId: "p1",
    cardType: "yellow" as const,
    minute: 45,
    reason: "Dangerous play",
  };

  it("allows admin", async () => {
    mockRequireMatchRole.mockResolvedValue(adminProfile);
    await expect(recordCardEvent(validCard)).resolves.toEqual({ success: true });
    expect(mockRequireMatchRole).toHaveBeenCalledWith("m1", ["admin", "referee"]);
  });

  it("allows assigned referee", async () => {
    mockRequireMatchRole.mockResolvedValue(refereeProfile);
    await expect(recordCardEvent(validCard)).resolves.toEqual({ success: true });
  });

  it("rejects unauthenticated user", async () => {
    mockRequireMatchRole.mockRejectedValue(new UnauthenticatedError());
    await expect(recordCardEvent(validCard)).rejects.toThrow(UnauthenticatedError);
  });

  it("rejects team_manager", async () => {
    mockRequireMatchRole.mockRejectedValue(new ForbiddenError());
    await expect(recordCardEvent(validCard)).rejects.toThrow(ForbiddenError);
  });
});

/* ── recordSubstitution ── */

describe("recordSubstitution authz", () => {
  const validSub = {
    matchId: "m1",
    teamId: "t1",
    playerOffId: "p1",
    playerOnId: "p2",
    minute: 60,
  };

  it("allows admin", async () => {
    mockRequireMatchRole.mockResolvedValue(adminProfile);
    await expect(recordSubstitution(validSub)).resolves.toEqual({ success: true });
    expect(mockRequireMatchRole).toHaveBeenCalledWith("m1", ["admin", "referee"]);
  });

  it("allows assigned referee", async () => {
    mockRequireMatchRole.mockResolvedValue(refereeProfile);
    await expect(recordSubstitution(validSub)).resolves.toEqual({ success: true });
  });

  it("rejects unauthenticated user", async () => {
    mockRequireMatchRole.mockRejectedValue(new UnauthenticatedError());
    await expect(recordSubstitution(validSub)).rejects.toThrow(UnauthenticatedError);
  });

  it("rejects forbidden role", async () => {
    mockRequireMatchRole.mockRejectedValue(new ForbiddenError());
    await expect(recordSubstitution(validSub)).rejects.toThrow(ForbiddenError);
  });
});

/* ── submitRefereeReport ── */

describe("submitRefereeReport authz", () => {
  const validReport = {
    matchId: "m1",
    refereeId: "ref-1",
    generalComment: "Good match",
  };

  it("allows admin", async () => {
    mockRequireMatchRole.mockResolvedValue(adminProfile);
    await expect(submitRefereeReport(validReport)).resolves.toEqual({ success: true });
    expect(mockRequireMatchRole).toHaveBeenCalledWith("m1", ["admin", "referee"]);
  });

  it("allows assigned referee", async () => {
    mockRequireMatchRole.mockResolvedValue(refereeProfile);
    await expect(submitRefereeReport(validReport)).resolves.toEqual({ success: true });
  });

  it("rejects unauthenticated user", async () => {
    mockRequireMatchRole.mockRejectedValue(new UnauthenticatedError());
    await expect(submitRefereeReport(validReport)).rejects.toThrow(UnauthenticatedError);
  });

  it("rejects forbidden role", async () => {
    mockRequireMatchRole.mockRejectedValue(new ForbiddenError());
    await expect(submitRefereeReport(validReport)).rejects.toThrow(ForbiddenError);
  });
});

/* ── updateMatchScore ── */

describe("updateMatchScore authz", () => {
  const validScore = { matchId: "m1", homeScore: 2, awayScore: 1 };

  it("allows admin", async () => {
    mockRequireMatchRole.mockResolvedValue(adminProfile);
    await expect(updateMatchScore(validScore)).resolves.toEqual({ success: true });
    expect(mockRequireMatchRole).toHaveBeenCalledWith("m1", ["admin", "referee"]);
  });

  it("allows assigned referee", async () => {
    mockRequireMatchRole.mockResolvedValue(refereeProfile);
    await expect(updateMatchScore(validScore)).resolves.toEqual({ success: true });
  });

  it("rejects unauthenticated user", async () => {
    mockRequireMatchRole.mockRejectedValue(new UnauthenticatedError());
    await expect(updateMatchScore(validScore)).rejects.toThrow(UnauthenticatedError);
  });

  it("rejects forbidden role", async () => {
    mockRequireMatchRole.mockRejectedValue(new ForbiddenError());
    await expect(updateMatchScore(validScore)).rejects.toThrow(ForbiddenError);
  });
});

/* ── createMatch (admin-only) ── */

describe("createMatch authz", () => {
  const validMatch = {
    matchDate: "2026-03-15",
    homeTeamId: "t1",
    awayTeamId: "t2",
  };

  it("allows admin", async () => {
    mockRequireRole.mockResolvedValue(adminProfile);
    await expect(createMatch(validMatch)).resolves.toBeDefined();
    expect(mockRequireRole).toHaveBeenCalledWith(["admin"]);
  });

  it("rejects referee", async () => {
    mockRequireRole.mockRejectedValue(new ForbiddenError());
    await expect(createMatch(validMatch)).rejects.toThrow(ForbiddenError);
  });

  it("rejects unauthenticated user", async () => {
    mockRequireRole.mockRejectedValue(new UnauthenticatedError());
    await expect(createMatch(validMatch)).rejects.toThrow(UnauthenticatedError);
  });
});
