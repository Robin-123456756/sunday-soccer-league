# System Overview

## Sunday Soccer League Matchday Recording System

### What This System Is
A digital platform for Sunday league operations that replaces paper-based records with structured, searchable matchday data.

### Core Purpose
- Record and store matchday information digitally
- Keep historical team, player, referee, and fixture records
- Support discipline tracking and match reporting workflows
- Prepare the foundation for uploads, exports, and reporting automation

### Primary Actors

#### League Admin
Main operator with full create/read/update/deactivate access across teams, players, referees, fixtures, seasons, and venues.

#### Referee
Assigned official who can later submit referee observations and discipline incidents.

#### Team Manager
Team representative who can later submit lineups and upload team sheet files.

### Delivery Status

| Module | Current Status | Notes |
|--------|----------------|-------|
| Dashboard | Implemented | KPI cards, recent matches, quick actions |
| Teams | Implemented | List/create/detail/edit/deactivate |
| Players | Implemented | List/create/detail/edit/deactivate |
| Referees | Implemented | List/create/detail/edit/deactivate |
| Matches | Implemented | List/create/detail/edit and status handling |
| Seasons and Venues | Implemented (data layer) | Server actions available for match form population |
| Authentication and RBAC | Planned | Actor model defined, enforcement pending |
| Lineups, Cards, Substitutions, Reports | Planned | Data model exists; UI/workflows pending |
| Uploads and Exports | Planned | Utility/model scaffolding exists |

### Documentation Set
- `docs/system-overview.md`
- `docs/requirements.md`
- `docs/user-flows.md`
- `docs/database-schema.md`
- `docs/api-spec.md`
- `docs/referee-report-format.md`
- `docs/ui-ux-spec.md`
- `docs/design-system.md`
- `docs/information-architecture.md`
- `docs/component-inventory.md`
- `docs/wireframes.md`

### Tech Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Next.js server actions
- Database: PostgreSQL (Supabase)
- ORM: Prisma
- File/Auth Services: Supabase Storage/Auth (planned integrations)
