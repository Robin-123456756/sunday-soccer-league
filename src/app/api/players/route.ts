import { getPlayersList } from "@/server/queries/players";
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
    const search = searchParams.get("search") ?? undefined;
    const statusParam = searchParams.get("status") ?? undefined;
    const isActive = statusParam === "active" ? true : statusParam === "inactive" ? false : undefined;

    const players = await getPlayersList({ teamId, search, isActive });
    return Response.json(players);
  } catch (err) {
    return internalErrorResponse(err);
  }
}
