export function validateMatchTeams(
  homeTeamId: string,
  awayTeamId: string
): string | null {
  if (homeTeamId === awayTeamId) {
    return "Home team and away team cannot be the same";
  }
  return null;
}

export function validateLineupPlayer(
  playerTeamId: string,
  selectedTeamId: string
): string | null {
  if (playerTeamId !== selectedTeamId) {
    return "Player does not belong to the selected team";
  }
  return null;
}

export function validateSubstitution(
  playerOffTeamId: string,
  playerOnTeamId: string,
  teamId: string
): string | null {
  if (playerOffTeamId !== teamId || playerOnTeamId !== teamId) {
    return "Both players must belong to the same team";
  }
  return null;
}

export function validateTeamSheetFile(file: File): string | null {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  if (!allowedTypes.includes(file.type)) {
    return "File must be an image (JPEG, PNG, WebP) or PDF";
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return "File size must be less than 10MB";
  }

  return null;
}

export function validateMinute(minute: number): string | null {
  if (minute < 0 || minute > 120) {
    return "Minute must be between 0 and 120";
  }
  return null;
}

/* ── Server-action-level validators ── */

const VALID_CARD_TYPES = ["yellow", "red", "second_yellow_red"] as const;
export type ValidCardType = (typeof VALID_CARD_TYPES)[number];

export function validateCardType(cardType: string): string | null {
  if (!(VALID_CARD_TYPES as readonly string[]).includes(cardType)) {
    return "Invalid card type.";
  }
  return null;
}

export function validateActionMinute(minute: number): string | null {
  if (!Number.isInteger(minute) || minute < 0 || minute > 130) {
    return "Minute must be a whole number between 0 and 130.";
  }
  return null;
}

export function validateScore(value: number | null, label: string): string | null {
  if (value !== null && (!Number.isInteger(value) || value < 0)) {
    return `${label} must be a non-negative whole number.`;
  }
  return null;
}

export function validateDifferentPlayers(
  playerOffId: string,
  playerOnId: string
): string | null {
  if (playerOffId === playerOnId) {
    return "Player coming off and player coming on must be different.";
  }
  return null;
}
