# System Overview

## Sunday Soccer League - Matchday Recording System

### What is this system?
A digital platform for managing Sunday soccer league operations. It replaces paper-based team sheets and manual record-keeping with a centralized system that captures every aspect of matchday activity.

### Core Purpose
- Record and store matchday information digitally
- Provide a historical archive of all league matches
- Streamline discipline tracking and referee reporting
- Eliminate paper team sheet loss

### System Actors

#### League Admin
The primary system user. Manages all league data including teams, players, referees, fixtures, and match records. Has full read/write access to everything in the system.

#### Referee
Assigned to matches by the admin. Submits match reports including discipline events (cards), general observations on time management, dress code, organization, and team conduct.

#### Team Manager / Team Official
Represents a team. Submits team lineups (starters and bench), uploads physical team sheet images, and reviews historical team sheet records.

### How It Works

1. **Pre-Match**: Admin creates fixtures, assigns referees. Team managers submit lineups and upload team sheet images.
2. **Match Day**: Referees record cards, substitutions, and match events as they happen.
3. **Post-Match**: Referees submit their full match report with observations. Admin reviews and finalizes the match record.
4. **Historical Access**: All records are permanently stored and searchable by matchday, team, player, referee, card type, or date range.

### System Modules

| Module | Responsibility |
|--------|---------------|
| Authentication | Login, role-based access control |
| League Management | Teams, players, referees, venues, seasons |
| Match Management | Fixtures, lineups, results, match reports |
| Discipline | Cards, caution reasons, repeat offender tracking |
| Media Storage | Team sheet image upload and retrieval |
| Reporting | Match, referee, discipline, and team history reports |
| Export | CSV and Excel exports of player and match data |

### Tech Stack
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes / Server Actions
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Auth**: Supabase Auth
- **File Storage**: Supabase Storage
