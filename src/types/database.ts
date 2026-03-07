export type AppRole = "admin" | "referee" | "team_manager";
export type MatchStatus = "scheduled" | "in_progress" | "completed" | "postponed";
export type LineupType = "starter" | "bench";
export type CardType = "yellow" | "red" | "second_yellow_red";
export type ExportType =
  | "player_details"
  | "team_players"
  | "discipline_report"
  | "appearance_report";
export type ExportFormat = "csv" | "xlsx";

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: AppRole;
  team_id: string | null;
  is_active: boolean;
}

export interface MatchRecord {
  id: string;
  matchday_id: string | null;
  match_date: string;
  kickoff_time: string | null;
  venue: string | null;
  home_team_id: string;
  away_team_id: string;
  home_jersey_color: string | null;
  away_jersey_color: string | null;
  referee_id: string | null;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface MatchLineupInput {
  matchId: string;
  teamId: string;
  starterIds: string[];
  benchIds: string[];
  captainPlayerId?: string | null;
}

export interface CardEventInput {
  matchId: string;
  teamId: string;
  playerId: string;
  cardType: CardType;
  minute: number;
  reason: string;
  refereeNote?: string | null;
}

export interface RefereeReportInput {
  matchId: string;
  refereeId: string;
  generalComment?: string | null;
  timeManagementObservation?: string | null;
  dressCodeObservation?: string | null;
  organizationObservation?: string | null;
  conductObservation?: string | null;
  incidents?: string | null;
}

export interface ExportPlayerFilters {
  teamId?: string;
  playerId?: string;
  seasonLabel?: string;
  matchdayId?: string;
  dateFrom?: string;
  dateTo?: string;
  cardType?: CardType;
}
