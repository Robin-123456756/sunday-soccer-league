export type UserRole = "admin" | "referee" | "team_manager";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  teamId?: string;
  refereeId?: string;
  isActive: boolean;
}

export interface Role {
  id: string;
  name: UserRole;
  description?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}
