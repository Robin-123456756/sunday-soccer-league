# Sunday Soccer League — Matchday Recording System

## 1. Purpose
Design a league management system for a Sunday soccer league where matchday information can be recorded, stored, reviewed, and reused by league administrators.

The system should allow the league to:
- Record fixtures and match details
- Capture home and away teams
- Store jersey colors used in each match
- Record the referee assigned to a game
- Record starting players and bench players
- Record substitutions
- Record cautions/cards and reasons
- Record referee comments and match observations
- Upload and store a matchday team sheet image
- Preserve team sheet records for future access by the league

---

## 2. Core Objectives
The platform should solve these operational problems:
1. Keep an official digital record of every league match
2. Reduce loss of paper team sheets
3. Make disciplinary tracking easier
4. Make lineup verification easier
5. Improve referee accountability and reporting
6. Create a historical archive for teams, players, referees, and matches

---

## 3. Main Users

### 3.1 League Admin
Can:
- Create teams
- Create players
- Create referees
- Create fixtures
- View all match records
- Upload or review team sheet images
- Edit match reports
- Review cautions and disciplinary records

### 3.2 Referee
Can:
- View assigned matches
- Submit match report
- Record cards and reasons
- Add observations
- Add comments about time management, dress code, organization, and conduct

### 3.3 Team Manager / Team Official
Can:
- Submit lineup
- Confirm starters and bench
- Upload team sheet image
- Review previous team sheets

---

## 4. Key Features

### 4.1 Match Setup
Each match should capture:
- Match date
- Kickoff time
- Venue
- Competition round / matchday
- Home team
- Away team
- Home jersey color
- Away jersey color
- Referee
- Assistant referees (optional)
- Match status (scheduled, in progress, completed, postponed)

### 4.2 Team Lineup Recording
For each team in a match:
- Starting XI
- Bench players
- Captain
- Coach / team official (optional)
- Team sheet image upload

### 4.3 Substitutions
There is **no limit** on the number of substitutions per team per match.
**Re-entry is allowed** — a player who has been substituted off may return to the pitch as a substitute later in the same match.

For each substitution:
- Match
- Team
- Player coming off
- Player coming on
- Minute
- Reason (optional: injury, tactical, fatigue)

### 4.4 Discipline / Cards
For each card event:
- Match
- Team
- Player
- Card type (yellow, red, second yellow)
- Minute
- Reason for caution / sending off
- Referee note

### 4.5 Referee Reporting
Referees should be able to submit:
- General match comment
- Time management observations
- Dress code observations
- Organization observations
- Crowd behavior / misconduct notes
- Team conduct observations
- Additional incidents

### 4.6 Team Sheet Image Upload
The system should support:
- Uploading a scanned or photographed team sheet
- Associating the image with a match and specific team
- Viewing the uploaded image later
- Downloading the image when needed
- Keeping a permanent historical record

### 4.7 Historical Access
League admins should be able to search by:
- Matchday
- Team
- Player
- Referee
- Card type
- Date range

### 4.8 Data Export
The system should support exporting player-related records in:
- CSV format
- Excel format (.xlsx)

Exports should be available for:
- Player registration details
- Team player lists
- Matchday squad lists
- Card / disciplinary history per player
- Appearance history per player
- Match participation history

Admins should be able to filter exports by:
- Team
- Player
- Season
- Matchday
- Date range
- Card type

---

## 5. Recommended System Modules

### 5.1 Authentication Module
- Admin login
- Referee login
- Team manager login
- Role-based access control

### 5.2 League Management Module
- Teams
- Players
- Referees
- Venues
- Seasons
- Matchdays / rounds

### 5.3 Match Management Module
- Create fixture
- Assign referee
- Record result
- Record lineups
- Record match report

### 5.4 Discipline Module
- Store yellow/red cards
- Store caution reasons
- Track repeat offenders
- Generate suspension summaries later if needed

### 5.5 Media / Document Storage Module
- Store team sheet images
- Attach files to specific matches
- Retrieve files from storage

### 5.6 Reporting Module
- Match reports
- Referee reports
- Discipline reports
- Team history reports

### 5.7 Export Module
- Export player data to CSV
- Export player data to Excel
- Export filtered league reports
- Export match participation and discipline summaries

---

## 6. Suggested Data Model

### 6.1 Team
```ts
Team {
  id: string
  name: string
  shortName?: string
  primaryColor?: string
  secondaryColor?: string
  homeVenue?: string
  createdAt: datetime
}
```

### 6.2 Player
```ts
Player {
  id: string
  teamId: string
  fullName: string
  jerseyNumber?: number
  position?: string
  dateOfBirth?: date
  registrationNumber?: string
  isActive: boolean
  createdAt: datetime
}
```

### 6.3 Referee
```ts
Referee {
  id: string
  fullName: string
  phone?: string
  email?: string
  level?: string
  isActive: boolean
  createdAt: datetime
}
```

### 6.4 Match
```ts
Match {
  id: string
  seasonId?: string
  matchdayId?: string
  matchDate: date
  kickoffTime?: time
  venue?: string
  homeTeamId: string
  awayTeamId: string
  homeJerseyColor?: string
  awayJerseyColor?: string
  refereeId?: string
  assistantReferee1Id?: string
  assistantReferee2Id?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed'
  homeScore?: number
  awayScore?: number
  createdAt: datetime
}
```

### 6.5 MatchLineup
```ts
MatchLineup {
  id: string
  matchId: string
  teamId: string
  playerId: string
  lineupType: 'starter' | 'bench'
  isCaptain: boolean
  createdAt: datetime
}
```

### 6.6 Substitution
```ts
Substitution {
  id: string
  matchId: string
  teamId: string
  playerOffId: string
  playerOnId: string
  minute: number
  reason?: string
  createdAt: datetime
}
```

### 6.7 CardEvent
```ts
CardEvent {
  id: string
  matchId: string
  teamId: string
  playerId: string
  cardType: 'yellow' | 'red' | 'second_yellow_red'
  minute: number
  reason: string
  refereeNote?: string
  createdAt: datetime
}
```

### 6.8 RefereeReport
```ts
RefereeReport {
  id: string
  matchId: string
  refereeId: string
  generalComment?: string
  timeManagementObservation?: string
  dressCodeObservation?: string
  organizationObservation?: string
  conductObservation?: string
  incidents?: string
  createdAt: datetime
}
```

### 6.9 TeamSheetUpload
```ts
TeamSheetUpload {
  id: string
  matchId: string
  teamId: string
  uploadedByUserId?: string
  fileName: string
  fileUrl: string
  fileType: string
  uploadedAt: datetime
}
```

### 6.10 CautionReason (optional reference table)
```ts
CautionReason {
  id: string
  name: string
  category?: string
}
```

### 6.11 ExportJob (optional, for audit trail)
```ts
ExportJob {
  id: string
  requestedByUserId: string
  exportType: 'player_details' | 'team_players' | 'discipline_report' | 'appearance_report'
  fileFormat: 'csv' | 'xlsx'
  filtersJson?: string
  fileUrl?: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: datetime
}
```

Examples:
- Dissent
- Dangerous play
- Persistent fouling
- Handball
- Delaying restart
- Unsporting behavior
- Violent conduct
- Serious foul play

---

## 7. Suggested Database Tables

```txt
teams
players
referees
seasons
matchdays
matches
match_lineups
substitutions
card_events
referee_reports
team_sheet_uploads
users
roles
caution_reasons
venues
export_jobs
```

---

## 8. Recommended File Structure

```txt
sunday-soccer-league/
├── README.md
├── docs/
│   ├── system-overview.md
│   ├── requirements.md
│   ├── user-flows.md
│   ├── database-schema.md
│   ├── api-spec.md
│   └── referee-report-format.md
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── matches/
│   │   ├── teams/
│   │   ├── players/
│   │   ├── referees/
│   │   ├── reports/
│   │   └── uploads/
│   ├── components/
│   │   ├── forms/
│   │   ├── matches/
│   │   ├── referees/
│   │   └── ui/
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── storage.ts
│   ├── types/
│   │   ├── match.ts
│   │   ├── player.ts
│   │   ├── referee.ts
│   │   └── report.ts
│   └── server/
│       ├── services/
│       └── actions/
├── public/
│   └── placeholders/
├── uploads/
│   └── team-sheets/
└── package.json
```

---

## 9. Necessary Files and What They Should Contain

### 9.1 `README.md`
Main project intro, setup, features, stack, and folder structure.

### 9.2 `docs/system-overview.md`
High-level explanation of the system and actors.

### 9.3 `docs/requirements.md`
Functional and non-functional requirements.

### 9.4 `docs/user-flows.md`
Step-by-step flows for admin, referee, and team manager.

### 9.5 `docs/database-schema.md`
Detailed explanation of entities and relationships.

### 9.6 `docs/api-spec.md`
All endpoints for matches, players, referees, reports, and uploads.

### 9.7 `docs/referee-report-format.md`
Standard referee report structure and fields.

### 9.8 `prisma/schema.prisma`
ORM schema for all database tables.

### 9.9 `src/types/*.ts`
TypeScript types for app-wide consistency.

### 9.10 `src/lib/storage.ts`
Image upload logic for team sheet files.

### 9.11 `src/lib/export.ts`
CSV and Excel export logic.

### 9.12 `src/app/reports/exports/page.tsx`
Export screen for admins to generate player CSV or Excel files.

---

## 10. Example README.md

```md
# Sunday Soccer League Matchday System

A digital system for recording Sunday soccer league matchday information, including lineups, substitutions, cards, referee reports, jersey colors, home/away designation, and uploaded team sheets.

## Features
- Match creation and scheduling
- Home and away team tracking
- Referee assignment
- Starting XI and bench recording
- Card and caution reason tracking
- Referee observations and comments
- Team sheet image upload and storage
- Historical access to match records
- CSV export of player details
- Excel export of player details

## Main Users
- League Admin
- Referee
- Team Manager

## Suggested Stack
- Next.js
- TypeScript
- PostgreSQL / Supabase
- Prisma or Supabase client
- Cloud storage for team sheet images

## Core Modules
- Authentication
- Match Management
- Team Lineups
- Discipline Tracking
- Referee Reporting
- Image Uploads

## Folder Structure
```txt
src/
docs/
prisma/
```

## Future Improvements
- Automatic suspensions from card accumulation
- Match statistics dashboard
- PDF export of referee reports
- OCR extraction from uploaded team sheets
```

---

## 11. Example `docs/requirements.md`

```md
# Requirements

## Functional Requirements
1. The system must allow admins to create teams, players, and referees.
2. The system must allow admins to create fixtures.
3. The system must store home and away teams for every match.
4. The system must store jersey colors for both teams.
5. The system must assign a referee to a match.
6. The system must record starters and bench players for each team.
7. The system must record substitutions.
8. The system must record cards, card types, and caution reasons.
9. The system must allow referees to submit match comments and observations.
10. The system must allow uploading of matchday team sheet images.
11. The system must allow league officials to retrieve past team sheet uploads.
12. The system must support search and filtering of historical match records.

## Non-Functional Requirements
1. The system should be simple enough for non-technical league officials.
2. The system should support mobile phone usage.
3. Uploaded images should be securely stored.
4. Access should be role-based.
5. Match records should remain historically accessible.
6. The system should validate required matchday inputs before submission.
```

---

## 12. Example `docs/user-flows.md`

```md
# User Flows

## Admin Flow
1. Admin logs in
2. Admin creates teams, players, and referees
3. Admin creates match fixture
4. Admin assigns referee
5. Admin reviews submitted lineup and reports
6. Admin accesses uploaded team sheets
7. Admin reviews disciplinary records

## Referee Flow
1. Referee logs in
2. Referee opens assigned match
3. Referee records cards and reasons
4. Referee adds match comments
5. Referee adds observations on time management, dress code, and organization
6. Referee submits final report

## Team Manager Flow
1. Team manager logs in
2. Team manager opens scheduled fixture
3. Team manager selects starters and bench
4. Team manager uploads team sheet image
5. Team manager submits lineup record
```

---

## 13. Example `docs/referee-report-format.md`

```md
# Referee Report Format

## Match Information
- Match ID
- Date
- Venue
- Home Team
- Away Team
- Referee

## Match Control Notes
- General Comment
- Time Management Observation
- Dress Code Observation
- Organization Observation
- Team Conduct Observation
- Notable Incidents

## Discipline Notes
- Player
- Team
- Card Type
- Minute
- Reason
- Additional Note
```

---

## 14. Example API Specification

```md
# API Specification

## Matches
- `POST /api/matches` -> create match
- `GET /api/matches` -> list matches
- `GET /api/matches/:id` -> get single match
- `PATCH /api/matches/:id` -> update match

## Exports
- `GET /api/exports/players.csv` -> export filtered player data as CSV
- `GET /api/exports/players.xlsx` -> export filtered player data as Excel
- `POST /api/exports/generate` -> create export job for large reports

## Lineups
- `POST /api/matches/:id/lineups` -> save lineup for a team
- `GET /api/matches/:id/lineups` -> get lineups

## Substitutions
- `POST /api/matches/:id/substitutions` -> record substitution
- `GET /api/matches/:id/substitutions` -> get substitutions

## Cards
- `POST /api/matches/:id/cards` -> record card
- `GET /api/matches/:id/cards` -> get card events

## Referee Reports
- `POST /api/matches/:id/referee-report` -> submit report
- `GET /api/matches/:id/referee-report` -> get report

## Uploads
- `POST /api/matches/:id/uploads/team-sheet` -> upload team sheet image
- `GET /api/matches/:id/uploads` -> get uploaded files
```

---

## 15. Recommended Form Screens

### 15.1 Create Match Screen
Fields:
- Date
- Kickoff time
- Venue
- Home team
- Away team
- Home jersey color
- Away jersey color
- Referee
- Status

### 15.2 Team Lineup Screen
Fields:
- Team
- Starters list
- Bench list
- Captain
- Team sheet upload

### 15.3 Card Entry Screen
Fields:
- Player
- Team
- Card type
- Minute
- Reason
- Referee note

### 15.4 Referee Report Screen
Fields:
- General comment
- Time management
- Dress code
- Organization
- Conduct
- Other incidents

---

## 16. Validation Rules

- Home team and away team cannot be the same
- A player cannot be both starter and bench in the same match
- Only players belonging to a team can be selected for that team lineup
- A substitution must reference one player off and one player on from the same team
- There is no limit on the number of substitutions per team per match
- Re-entry is allowed — a substituted player may come back on later in the same match
- Card events must reference a valid player in the match
- Team sheet uploads must be image or PDF files only
- Referee report cannot be submitted without a linked match

---

## 17. Storage Recommendations

### Team Sheet Uploads
Store files in cloud storage with path format:
```txt
team-sheets/{season}/{matchId}/{teamId}/{filename}
```

Metadata to save:
- Match ID
- Team ID
- File name
- File URL
- Uploaded by
- Uploaded at
- MIME type

---

## 18. Future Enhancements
- OCR extraction from team sheets
- Automatic lineup suggestion from previous matches
- Suspension rules from yellow/red card accumulation
- Public match center view
- Export reports to PDF
- Mobile-first referee app
- Player availability tracking
- Scheduled exports for league admins

## 19. Best Recommended Tech Stack

### Option A: Fast MVP
- Next.js
- TypeScript
- Supabase Database
- Supabase Storage
- Supabase Auth
- Tailwind CSS

### Option B: Structured Enterprise Setup
- Next.js
- TypeScript
- PostgreSQL
- Prisma
- NextAuth / Clerk
- S3-compatible storage

For your use case, **Option A is the best starting point** because it is fast to build, good for uploads, and works well for league admin dashboards.

---

## 20. Build Order

### Phase 1
- Teams
- Players
- Referees
- Fixtures

### Phase 2
- Lineups
- Bench tracking
- Home/away info
- Jersey colors

### Phase 3
- Cards and caution reasons
- Referee comments
- Match observations

### Phase 4
- Team sheet image upload
- Historical search and retrieval

### Phase 5
- Reports and exports
- Suspensions and discipline automation

---

## 21. Recommendation
Start by building these first:
1. Team management
2. Player management
3. Match creation
4. Lineup recording
5. Card recording
6. Referee report submission
7. Team sheet image upload

That gives you a usable league operations system quickly.

