import { getRefereesList } from "@/server/queries/referees";
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
    const search = searchParams.get("search") ?? undefined;
    const statusParam = searchParams.get("status") ?? undefined;
    const isActive = statusParam === "active" ? true : statusParam === "inactive" ? false : undefined;

    const referees = await getRefereesList({ search, isActive });
    return Response.json(referees);
  } catch (err) {
    return internalErrorResponse(err);
  }
}
