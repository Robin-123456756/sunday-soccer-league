import { NextResponse } from "next/server";
import { toCsv, toExcelBuffer } from "@/lib/export";
import type { PlayerExportRow } from "@/types/player";

function sampleRows(): PlayerExportRow[] {
  return [
    {
      fullName: "Sample Player",
      teamName: "Sample FC",
      jerseyNumber: 10,
      position: "Midfielder",
      registrationNumber: "REG-001",
      isActive: true,
      yellowCards: 1,
      redCards: 0,
      appearances: 3,
    },
  ];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "csv";
  const rows = sampleRows();

  if (format === "xlsx") {
    const buffer = toExcelBuffer(rows);
    return new NextResponse(new Uint8Array(buffer), {
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
