import * as XLSX from "xlsx";
import type { PlayerExportRow } from "@/types/player";

export function toCsv(rows: PlayerExportRow[]): string {
  const headers = [
    "fullName",
    "teamName",
    "jerseyNumber",
    "position",
    "registrationNumber",
    "isActive",
    "yellowCards",
    "redCards",
    "appearances",
  ];

  const escapeValue = (value: unknown): string => {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  };

  const lines = [headers.join(",")];

  for (const row of rows) {
    lines.push(
      [
        row.fullName,
        row.teamName,
        row.jerseyNumber,
        row.position,
        row.registrationNumber,
        row.isActive,
        row.yellowCards,
        row.redCards,
        row.appearances,
      ]
        .map(escapeValue)
        .join(",")
    );
  }

  return lines.join("\n");
}

export function toExcelBuffer(rows: PlayerExportRow[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Players");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}
