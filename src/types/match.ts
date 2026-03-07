export type MatchStatus = "scheduled" | "in_progress" | "completed" | "postponed";
export type LineupType = "starter" | "bench";
export type CardType = "yellow" | "red" | "second_yellow_red";

export interface Match {
  id: string;
  matchdayId?: string;
  matchDate: string;
  kickoffTimeLabel?: string;
  venue?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeJerseyColor?: string;
  awayJerseyColor?: string;
  refereeId?: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
}

export interface MatchLineup {
  id: string;
  matchId: string;
  teamId: string;
  playerId: string;
  lineupType: LineupType;
  isCaptain: boolean;
}

export interface Substitution {
  id: string;
  matchId: string;
  teamId: string;
  playerOffId: string;
  playerOnId: string;
  minute: number;
  reason?: string;
}

export interface CardEvent {
  id: string;
  matchId: string;
  teamId: string;
  playerId: string;
  cardType: CardType;
  minute: number;
  reason: string;
  refereeNote?: string;
}
