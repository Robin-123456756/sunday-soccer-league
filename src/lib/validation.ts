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
