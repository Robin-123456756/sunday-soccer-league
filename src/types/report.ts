export type ExportType = "player_details" | "team_players" | "discipline_report" | "appearance_report";
export type ExportFormat = "csv" | "xlsx";
export type ExportStatus = "pending" | "completed" | "failed";

export interface ExportJob {
  id: string;
  requestedByUserId: string;
  exportType: ExportType;
  fileFormat: ExportFormat;
  filtersJson?: string;
  fileUrl?: string;
  status: ExportStatus;
  createdAt: string;
}

export interface ExportFilters {
  teamId?: string;
  playerId?: string;
  seasonId?: string;
  matchdayId?: string;
  dateFrom?: string;
  dateTo?: string;
  cardType?: string;
}

export interface TeamSheetUpload {
  id: string;
  matchId: string;
  teamId: string;
  uploadedByUserId?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}
