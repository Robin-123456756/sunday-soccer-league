import { describe, it, expect } from "vitest";
import {
  routeAllowsRole,
  isPublicPath,
  isExcludedFromAuth,
  getDefaultRouteForRole,
} from "@/lib/auth/routes";

describe("getDefaultRouteForRole", () => {
  it("returns /dashboard for admin", () => {
    expect(getDefaultRouteForRole("admin")).toBe("/dashboard");
  });

  it("returns /team-manager/lineups for team_manager", () => {
    expect(getDefaultRouteForRole("team_manager")).toBe("/team-manager/lineups");
  });

  it("returns /referee/assigned-matches for referee", () => {
    expect(getDefaultRouteForRole("referee")).toBe("/referee/assigned-matches");
  });
});

describe("isPublicPath", () => {
  it("treats root as public", () => {
    expect(isPublicPath("/")).toBe(true);
  });

  it("treats /sign-in as public", () => {
    expect(isPublicPath("/sign-in")).toBe(true);
  });

  it("treats /forgot-password as public", () => {
    expect(isPublicPath("/forgot-password")).toBe(true);
  });

  it("treats /auth/confirm as public", () => {
    expect(isPublicPath("/auth/confirm")).toBe(true);
  });

  it("treats /auth/error as public", () => {
    expect(isPublicPath("/auth/error")).toBe(true);
  });

  it("treats /dashboard as non-public", () => {
    expect(isPublicPath("/dashboard")).toBe(false);
  });

  it("treats /matches as non-public", () => {
    expect(isPublicPath("/matches")).toBe(false);
  });
});

describe("isExcludedFromAuth", () => {
  it("excludes /_next paths", () => {
    expect(isExcludedFromAuth("/_next/static/chunk.js")).toBe(true);
  });

  it("excludes /api paths", () => {
    expect(isExcludedFromAuth("/api/matches")).toBe(true);
  });

  it("does not exclude /dashboard", () => {
    expect(isExcludedFromAuth("/dashboard")).toBe(false);
  });
});

describe("routeAllowsRole", () => {
  describe("admin routes", () => {
    it("allows admin to /dashboard", () => {
      expect(routeAllowsRole("/dashboard", "admin")).toBe(true);
    });

    it("denies referee to /dashboard", () => {
      expect(routeAllowsRole("/dashboard", "referee")).toBe(false);
    });

    it("denies team_manager to /dashboard", () => {
      expect(routeAllowsRole("/dashboard", "team_manager")).toBe(false);
    });

    it("allows admin to /admin/users", () => {
      expect(routeAllowsRole("/admin/users", "admin")).toBe(true);
    });

    it("denies referee to /admin/users", () => {
      expect(routeAllowsRole("/admin/users", "referee")).toBe(false);
    });

    it("allows admin to /teams", () => {
      expect(routeAllowsRole("/teams", "admin")).toBe(true);
    });

    it("denies referee to /teams", () => {
      expect(routeAllowsRole("/teams", "referee")).toBe(false);
    });

    it("allows admin to /players", () => {
      expect(routeAllowsRole("/players", "admin")).toBe(true);
    });

    it("denies team_manager to /players", () => {
      expect(routeAllowsRole("/players", "team_manager")).toBe(false);
    });

    it("allows admin to /referees", () => {
      expect(routeAllowsRole("/referees", "admin")).toBe(true);
    });

    it("denies team_manager to /referees", () => {
      expect(routeAllowsRole("/referees", "team_manager")).toBe(false);
    });
  });

  describe("report routes (admin-only)", () => {
    it("allows admin to /reports/exports", () => {
      expect(routeAllowsRole("/reports/exports", "admin")).toBe(true);
    });

    it("allows admin to /reports/discipline", () => {
      expect(routeAllowsRole("/reports/discipline", "admin")).toBe(true);
    });

    it("allows admin to /reports/appearances", () => {
      expect(routeAllowsRole("/reports/appearances", "admin")).toBe(true);
    });

    it("denies referee to /reports/discipline", () => {
      expect(routeAllowsRole("/reports/discipline", "referee")).toBe(false);
    });

    it("denies team_manager to /reports/exports", () => {
      expect(routeAllowsRole("/reports/exports", "team_manager")).toBe(false);
    });
  });

  describe("role-specific routes", () => {
    it("allows team_manager to /team-manager/lineups", () => {
      expect(routeAllowsRole("/team-manager/lineups", "team_manager")).toBe(true);
    });

    it("denies admin to /team-manager/lineups", () => {
      expect(routeAllowsRole("/team-manager/lineups", "admin")).toBe(false);
    });

    it("denies referee to /team-manager/lineups", () => {
      expect(routeAllowsRole("/team-manager/lineups", "referee")).toBe(false);
    });

    it("allows referee to /referee/assigned-matches", () => {
      expect(routeAllowsRole("/referee/assigned-matches", "referee")).toBe(true);
    });

    it("denies admin to /referee/assigned-matches", () => {
      expect(routeAllowsRole("/referee/assigned-matches", "admin")).toBe(false);
    });

    it("denies team_manager to /referee/assigned-matches", () => {
      expect(routeAllowsRole("/referee/assigned-matches", "team_manager")).toBe(false);
    });
  });

  describe("match routes", () => {
    it("allows all roles to /matches list", () => {
      expect(routeAllowsRole("/matches", "admin")).toBe(true);
      expect(routeAllowsRole("/matches", "referee")).toBe(true);
      expect(routeAllowsRole("/matches", "team_manager")).toBe(true);
    });

    it("allows all roles to match detail", () => {
      expect(routeAllowsRole("/matches/some-id", "admin")).toBe(true);
      expect(routeAllowsRole("/matches/some-id", "referee")).toBe(true);
      expect(routeAllowsRole("/matches/some-id", "team_manager")).toBe(true);
    });

    it("restricts /matches/new to admin", () => {
      expect(routeAllowsRole("/matches/new", "admin")).toBe(true);
      expect(routeAllowsRole("/matches/new", "referee")).toBe(false);
      expect(routeAllowsRole("/matches/new", "team_manager")).toBe(false);
    });

    it("allows all roles to match sub-pages", () => {
      const subPages = ["edit", "lineups", "cards", "substitutions", "referee-report", "uploads"];
      for (const page of subPages) {
        expect(routeAllowsRole(`/matches/some-id/${page}`, "admin")).toBe(true);
        expect(routeAllowsRole(`/matches/some-id/${page}`, "referee")).toBe(true);
        expect(routeAllowsRole(`/matches/some-id/${page}`, "team_manager")).toBe(true);
      }
    });
  });

  describe("catch-all default", () => {
    it("allows unknown routes by default", () => {
      expect(routeAllowsRole("/some-unknown-route", "admin")).toBe(true);
      expect(routeAllowsRole("/some-unknown-route", "referee")).toBe(true);
    });
  });
});
