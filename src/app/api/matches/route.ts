import { getMatches } from "@/server/queries/matches";
import { requireRole } from "@/server/queries/auth";
import { authErrorResponse, internalErrorResponse } from "@/lib/api-error";

export async function GET(request: Request) {
  try {
    await requireRole(["admin"]);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId") ?? undefined;
    const refereeId = searchParams.get("refereeId") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const dateFrom = searchParams.get("dateFrom") ?? undefined;
    const dateTo = searchParams.get("dateTo") ?? undefined;

    const matches = await getMatches({ teamId, refereeId, status, dateFrom, dateTo });
    return Response.json(matches);
  } catch (err) {
    return internalErrorResponse(err);
  }
}
