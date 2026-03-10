import { describe, it, expect } from "vitest";
import {
  validateMatchTeams,
  validateLineupPlayer,
  validateSubstitution,
  validateMinute,
  validateCardType,
  validateActionMinute,
  validateScore,
  validateDifferentPlayers,
} from "@/lib/validation";

describe("validateMatchTeams", () => {
  it("returns error when home and away are the same", () => {
    expect(validateMatchTeams("team-1", "team-1")).not.toBeNull();
  });

  it("returns null when teams are different", () => {
    expect(validateMatchTeams("team-1", "team-2")).toBeNull();
  });
});

describe("validateLineupPlayer", () => {
  it("returns error when player team does not match", () => {
    expect(validateLineupPlayer("team-1", "team-2")).not.toBeNull();
  });

  it("returns null when player belongs to team", () => {
    expect(validateLineupPlayer("team-1", "team-1")).toBeNull();
  });
});

describe("validateSubstitution", () => {
  it("returns error when playerOff is from wrong team", () => {
    expect(validateSubstitution("wrong-team", "team-1", "team-1")).not.toBeNull();
  });

  it("returns error when playerOn is from wrong team", () => {
    expect(validateSubstitution("team-1", "wrong-team", "team-1")).not.toBeNull();
  });

  it("returns null when both players belong to team", () => {
    expect(validateSubstitution("team-1", "team-1", "team-1")).toBeNull();
  });
});

describe("validateMinute (form-level)", () => {
  it("returns error for negative minute", () => {
    expect(validateMinute(-1)).not.toBeNull();
  });

  it("returns error for minute > 120", () => {
    expect(validateMinute(121)).not.toBeNull();
  });

  it("returns null for valid minute", () => {
    expect(validateMinute(0)).toBeNull();
    expect(validateMinute(45)).toBeNull();
    expect(validateMinute(120)).toBeNull();
  });
});

describe("validateCardType", () => {
  it("accepts yellow", () => {
    expect(validateCardType("yellow")).toBeNull();
  });

  it("accepts red", () => {
    expect(validateCardType("red")).toBeNull();
  });

  it("accepts second_yellow_red", () => {
    expect(validateCardType("second_yellow_red")).toBeNull();
  });

  it("rejects invalid card type", () => {
    expect(validateCardType("green")).not.toBeNull();
  });

  it("rejects empty string", () => {
    expect(validateCardType("")).not.toBeNull();
  });
});

describe("validateActionMinute (server-action-level)", () => {
  it("accepts 0", () => {
    expect(validateActionMinute(0)).toBeNull();
  });

  it("accepts 90", () => {
    expect(validateActionMinute(90)).toBeNull();
  });

  it("accepts 130 (max extra time)", () => {
    expect(validateActionMinute(130)).toBeNull();
  });

  it("rejects negative", () => {
    expect(validateActionMinute(-1)).not.toBeNull();
  });

  it("rejects > 130", () => {
    expect(validateActionMinute(131)).not.toBeNull();
  });

  it("rejects non-integer", () => {
    expect(validateActionMinute(45.5)).not.toBeNull();
  });

  it("rejects NaN", () => {
    expect(validateActionMinute(NaN)).not.toBeNull();
  });
});

describe("validateScore", () => {
  it("accepts null (no score yet)", () => {
    expect(validateScore(null, "Home score")).toBeNull();
  });

  it("accepts 0", () => {
    expect(validateScore(0, "Home score")).toBeNull();
  });

  it("accepts positive integer", () => {
    expect(validateScore(5, "Away score")).toBeNull();
  });

  it("rejects negative", () => {
    expect(validateScore(-1, "Home score")).not.toBeNull();
  });

  it("rejects non-integer", () => {
    expect(validateScore(2.5, "Away score")).not.toBeNull();
  });

  it("includes label in error message", () => {
    const result = validateScore(-1, "Home score");
    expect(result).toContain("Home score");
  });
});

describe("validateDifferentPlayers", () => {
  it("returns error when same player", () => {
    expect(validateDifferentPlayers("player-1", "player-1")).not.toBeNull();
  });

  it("returns null when different players", () => {
    expect(validateDifferentPlayers("player-1", "player-2")).toBeNull();
  });
});
