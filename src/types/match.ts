export type MatchStatus = "scheduled" | "in_progress" | "completed" | "postponed";
export type LineupType = "starter" | "bench";
export type CardType = "yellow" | "red" | "second_yellow_red";

export interface Match {
  id: string;
  seasonId?: string;
  matchdayId?: string;
  matchDate: string;
  kickoffTime?: string;
  venueId?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeJerseyColor?: string;
  awayJerseyColor?: string;
  refereeId?: string;
  assistantReferee1Id?: string;
  assistantReferee2Id?: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatchLineup {
  id: string;
  matchId: string;
  teamId: string;
  playerId: string;
  lineupType: LineupType;
  isCaptain: boolean;
  createdAt: string;
}

export interface Substitution {
  id: string;
  matchId: string;
  teamId: string;
  playerOffId: string;
  playerOnId: string;
  minute: number;
  reason?: string;
  createdAt: string;
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
  createdAt: string;
}

export interface MatchWithDetails extends Match {
  homeTeam: { id: string; name: string; shortName?: string };
  awayTeam: { id: string; name: string; shortName?: string };
  venue?: { id: string; name: string };
  referee?: { id: string; fullName: string };
  season?: { id: string; name: string };
  matchday?: { id: string; name: string };
}
