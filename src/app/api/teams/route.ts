import { getTeamsWithCounts } from "@/server/queries/teams";
import { requireRole } from "@/server/queries/auth";
import { authErrorResponse, internalErrorResponse } from "@/lib/api-error";

export async function GET() {
  try {
    await requireRole(["admin"]);
  } catch (err) {
    return authErrorResponse(err);
  }

  try {
    const teams = await getTeamsWithCounts();
    return Response.json(teams);
  } catch (err) {
    return internalErrorResponse(err);
  }
}
