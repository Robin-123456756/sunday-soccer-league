export interface Player {
  id: string;
  teamId: string;
  fullName: string;
  jerseyNumber?: number;
  position?: string;
  dateOfBirth?: string;
  registrationNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PlayerWithTeam extends Player {
  team: { id: string; name: string; shortName?: string };
}
