import { NextResponse } from "next/server";
import { toCsv, toExcelBuffer } from "@/lib/export";
import { getExportablePlayerRows } from "@/server/queries/players";
import { requireRole } from "@/server/queries/auth";

export async function GET(request: Request) {
  await requireRole(["admin"]);

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";
  const teamId = searchParams.get("teamId") ?? undefined;
  const playerId = searchParams.get("playerId") ?? undefined;

  const rows = await getExportablePlayerRows({ teamId, playerId });

  if (format === "xlsx") {
    const buffer = toExcelBuffer(rows);
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer;

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="players.xlsx"',
      },
    });
  }

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="players.csv"',
    },
  });
}
