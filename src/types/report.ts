export interface RefereeReport {
  id: string;
  matchId: string;
  refereeId: string;
  generalComment?: string;
  timeManagementObservation?: string;
  dressCodeObservation?: string;
  organizationObservation?: string;
  conductObservation?: string;
  incidents?: string;
}

export type ExportFormat = "csv" | "xlsx";
export type ExportType =
  | "player_details"
  | "team_players"
  | "discipline_report"
  | "appearance_report";
