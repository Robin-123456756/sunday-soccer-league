# Information Architecture

## Top-Level Structure (Implemented)
- `/` -> redirect to `/dashboard`
- `/dashboard`
- `/teams`
- `/players`
- `/referees`
- `/matches`

## Route Tree

### Teams
- `/teams` list
- `/teams/create` create form
- `/teams/:id` detail
- `/teams/:id/edit` edit form

### Players
- `/players` list
- `/players/create` create form
- `/players/:id` detail
- `/players/:id/edit` edit form

### Referees
- `/referees` list
- `/referees/create` create form
- `/referees/:id` detail
- `/referees/:id/edit` edit form

### Matches
- `/matches` list
- `/matches/create` create form
- `/matches/:id` detail
- `/matches/:id/edit` edit form

## Navigation Model
- Persistent left sidebar for top-level sections
- Breadcrumbs are not currently implemented
- Detail pages use explicit "Back to ..." actions

## Data Relationships in Navigation
- Team detail links to team player roster
- Player detail links back to owning team
- Dashboard recent matches link to individual match detail

## Planned IA Extensions
- Reports and exports section
- Match sub-sections for lineups, substitutions, cards, referee reports, and uploads
- Role-based landing pages when authentication is enabled
