# Requirements

## Functional Requirements
1. The system must allow creation of teams, players, referees, venues, and matchdays.
2. The system must allow admins to create and update fixtures.
3. The system must record home and away teams for every match.
4. The system must record jersey colors used by each team in a match.
5. The system must assign referees to matches.
6. The system must record starters and bench players per team.
7. The system must record substitutions with minute and optional reason.
8. The system must record yellow cards, red cards, and second-yellow red cards.
9. The system must record the reason for cautions or dismissals.
10. The system must allow referees to submit comments and observations.
11. The system must allow upload of matchday team sheet images or PDFs.
12. The system must support historical search by team, player, matchday, referee, or date.
13. The system must export player-related data as CSV.
14. The system must export player-related data as Excel.

15. The system must record match scores with optional "mark as completed" status change.
16. The system must track repeat offenders (players with 2+ cards across matches).
17. The system must track player appearance stats (total matches, starter, bench).
18. The system must provide REST API endpoints for external integrations.
19. The system must support search and filtering for matches, players, and referees via URL params.
20. The system must allow unlimited substitutions with re-entry per league rules.

## Non-Functional Requirements
1. The system should be easy for non-technical users.
2. The system should be mobile-friendly for referees.
3. The system should validate required inputs.
4. Uploaded files should be stored securely.
5. Access should be role-based with middleware-enforced route protection.
6. Historical records should remain accessible.
7. Route authorization should be centralized and checked at the middleware level.
8. Inactive users should be denied access at the middleware level.
9. Authentication redirects should preserve the original destination URL.
10. Email templates for invites and password resets should be branded and styled.
