export interface Player {
  id: string;
  teamId: string;
  fullName: string;
  jerseyNumber?: number;
  position?: string;
  registrationNumber?: string;
  isActive: boolean;
}

export interface PlayerExportRow {
  fullName: string;
  teamName: string;
  jerseyNumber?: number;
  position?: string;
  registrationNumber?: string;
  isActive: boolean;
  yellowCards?: number;
  redCards?: number;
  appearances?: number;
}
