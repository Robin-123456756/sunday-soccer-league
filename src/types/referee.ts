export interface Referee {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  level?: string;
  isActive: boolean;
  createdAt: string;
}

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
  createdAt: string;
  updatedAt: string;
}
