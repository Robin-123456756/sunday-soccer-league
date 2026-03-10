import { getMatchDetails, getMatchCardEvents, getMatchSubstitutions, getMatchLineupRows } from "@/server/queries/matches";
import { requireRole } from "@/server/queries/auth";
import { authErrorResponse, internalErrorResponse } from "@/lib/api-error";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(["admin"]);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { id } = await params;

    const match = await getMatchDetails(id);
    const [cards, substitutions] = await Promise.all([
      getMatchCardEvents(id),
      getMatchSubstitutions(id),
    ]);

    const teams = [match.home_team, match.away_team].filter(Boolean) as Array<{ id: string; name: string }>;
    const lineups = await Promise.all(
      teams.map(async (team) => ({
        teamId: team.id,
        teamName: team.name,
        players: await getMatchLineupRows(id, team.id),
      }))
    );

    return Response.json({ ...match, cards, substitutions, lineups });
  } catch (err) {
    return internalErrorResponse(err);
  }
}
