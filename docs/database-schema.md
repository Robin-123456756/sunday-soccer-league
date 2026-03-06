# Database Schema

## Entity Relationship Overview

```
Season 1──* Matchday 1──* Match
Team 1──* Player
Match *──1 Team (home)
Match *──1 Team (away)
Match *──1 Referee
Match *──1 Venue
Match 1──* MatchLineup
Match 1──* Substitution
Match 1──* CardEvent
Match 1──1 RefereeReport
Match 1──* TeamSheetUpload
User *──1 Role
```

---

## Entities

### User
Represents any authenticated system user (admin, referee, team manager).

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| email | String | Unique, required |
| passwordHash | String | Required |
| fullName | String | Required |
| roleId | UUID | FK -> Role |
| teamId | UUID? | FK -> Team (for team managers only) |
| refereeId | UUID? | FK -> Referee (for referee users only) |
| isActive | Boolean | Default: true |
| createdAt | DateTime | Auto-set |
| updatedAt | DateTime | Auto-updated |

### Role
Defines system roles for access control.

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| name | String | Unique, required (admin, referee, team_manager) |
| description | String? | Optional |
| createdAt | DateTime | Auto-set |

### Season
Represents a league season.

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| name | String | Required (e.g., "2026 Spring Season") |
| startDate | Date | Required |
| endDate | Date | Required |
| isActive | Boolean | Default: true |
| createdAt | DateTime | Auto-set |

### Matchday
Represents a round or matchday within a season.

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| seasonId | UUID | FK -> Season |
| name | String | Required (e.g., "Matchday 1", "Round 5") |
| date | Date? | Optional scheduled date |
| createdAt | DateTime | Auto-set |

### Venue
Represents a match venue/ground.

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| name | String | Required |
| address | String? | Optional |
| city | String? | Optional |
| createdAt | DateTime | Auto-set |

### Team
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| name | String | Unique, required |
| shortName | String? | Optional abbreviation |
| primaryColor | String? | Optional |
| secondaryColor | String? | Optional |
| homeVenueId | UUID? | FK -> Venue |
| isActive | Boolean | Default: true |
| createdAt | DateTime | Auto-set |

### Player
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| teamId | UUID | FK -> Team |
| fullName | String | Required |
| jerseyNumber | Int? | Optional |
| position | String? | Optional (GK, DEF, MID, FWD) |
| dateOfBirth | Date? | Optional |
| registrationNumber | String? | Optional, unique |
| isActive | Boolean | Default: true |
| createdAt | DateTime | Auto-set |

### Referee
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| fullName | String | Required |
| phone | String? | Optional |
| email | String? | Optional |
| level | String? | Optional (e.g., "Level 1", "Senior") |
| isActive | Boolean | Default: true |
| createdAt | DateTime | Auto-set |

### Match
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| seasonId | UUID? | FK -> Season |
| matchdayId | UUID? | FK -> Matchday |
| matchDate | Date | Required |
| kickoffTime | String? | Optional (e.g., "10:00") |
| venueId | UUID? | FK -> Venue |
| homeTeamId | UUID | FK -> Team |
| awayTeamId | UUID | FK -> Team |
| homeJerseyColor | String? | Optional |
| awayJerseyColor | String? | Optional |
| refereeId | UUID? | FK -> Referee |
| assistantReferee1Id | UUID? | FK -> Referee |
| assistantReferee2Id | UUID? | FK -> Referee |
| status | Enum | scheduled, in_progress, completed, postponed |
| homeScore | Int? | Optional |
| awayScore | Int? | Optional |
| createdAt | DateTime | Auto-set |
| updatedAt | DateTime | Auto-updated |

**Constraint**: homeTeamId != awayTeamId

### MatchLineup
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| matchId | UUID | FK -> Match |
| teamId | UUID | FK -> Team |
| playerId | UUID | FK -> Player |
| lineupType | Enum | starter, bench |
| isCaptain | Boolean | Default: false |
| createdAt | DateTime | Auto-set |

**Constraint**: Unique(matchId, teamId, playerId)

### Substitution
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| matchId | UUID | FK -> Match |
| teamId | UUID | FK -> Team |
| playerOffId | UUID | FK -> Player |
| playerOnId | UUID | FK -> Player |
| minute | Int | Required |
| reason | String? | Optional (injury, tactical, fatigue) |
| createdAt | DateTime | Auto-set |

### CardEvent
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| matchId | UUID | FK -> Match |
| teamId | UUID | FK -> Team |
| playerId | UUID | FK -> Player |
| cardType | Enum | yellow, red, second_yellow_red |
| minute | Int | Required |
| reason | String | Required |
| refereeNote | String? | Optional |
| createdAt | DateTime | Auto-set |

### RefereeReport
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| matchId | UUID | FK -> Match, Unique |
| refereeId | UUID | FK -> Referee |
| generalComment | String? | Optional |
| timeManagementObservation | String? | Optional |
| dressCodeObservation | String? | Optional |
| organizationObservation | String? | Optional |
| conductObservation | String? | Optional |
| incidents | String? | Optional |
| createdAt | DateTime | Auto-set |
| updatedAt | DateTime | Auto-updated |

### TeamSheetUpload
| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| matchId | UUID | FK -> Match |
| teamId | UUID | FK -> Team |
| uploadedByUserId | UUID? | FK -> User |
| fileName | String | Required |
| fileUrl | String | Required |
| fileType | String | Required (MIME type) |
| uploadedAt | DateTime | Auto-set |

### CautionReason
Reference table for standardized caution reasons.

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| name | String | Required |
| category | String? | Optional |

**Seed data**: Dissent, Dangerous play, Persistent fouling, Handball, Delaying restart, Unsporting behavior, Violent conduct, Serious foul play

### ExportJob
Audit trail for data exports.

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, auto-generated |
| requestedByUserId | UUID | FK -> User |
| exportType | Enum | player_details, team_players, discipline_report, appearance_report |
| fileFormat | Enum | csv, xlsx |
| filtersJson | String? | JSON string of applied filters |
| fileUrl | String? | Generated file URL |
| status | Enum | pending, completed, failed |
| createdAt | DateTime | Auto-set |
