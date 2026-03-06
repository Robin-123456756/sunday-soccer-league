export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface Matchday {
  id: string;
  seasonId: string;
  name: string;
  date?: string;
  createdAt: string;
}

export interface Venue {
  id: string;
  name: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  homeVenueId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface TeamWithPlayers extends Team {
  players: {
    id: string;
    fullName: string;
    jerseyNumber?: number;
    position?: string;
    isActive: boolean;
  }[];
}

export interface CautionReason {
  id: string;
  name: string;
  category?: string;
}
