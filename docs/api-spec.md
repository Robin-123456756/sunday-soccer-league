# Interface Specification

This project currently exposes application behavior through Next.js pages and server actions (not public REST API routes yet).

## 1. Implemented Route Surface

### Core Pages
- `GET /` -> redirects to `/dashboard`
- `GET /dashboard`
- `GET /teams`, `GET /teams/create`, `GET /teams/:id`, `GET /teams/:id/edit`
- `GET /players`, `GET /players/create`, `GET /players/:id`, `GET /players/:id/edit`
- `GET /referees`, `GET /referees/create`, `GET /referees/:id`, `GET /referees/:id/edit`
- `GET /matches`, `GET /matches/create`, `GET /matches/:id`, `GET /matches/:id/edit`

## 2. Implemented Server Action Surface

### Teams (`src/server/actions/teams.ts`)
- `getTeams()`
- `getTeamById(id)`
- `createTeam(formData)`
- `updateTeam(id, formData)`
- `deleteTeam(id)` (soft deactivate)

### Players (`src/server/actions/players.ts`)
- `getPlayers(teamId?)`
- `getPlayerById(id)`
- `createPlayer(formData)`
- `updatePlayer(id, formData)`
- `deletePlayer(id)` (soft deactivate)

### Referees (`src/server/actions/referees.ts`)
- `getReferees()`
- `getRefereeById(id)`
- `createReferee(formData)`
- `updateReferee(id, formData)`
- `deleteReferee(id)` (soft deactivate)

### Matches (`src/server/actions/matches.ts`)
- `getMatches(filters?)`
- `getMatchById(id)`
- `createMatch(formData)`
- `updateMatch(id, formData)`
- `deleteMatch(id)` (hard delete)

### Supporting Data (`src/server/actions/seasons.ts`, `venues.ts`)
- `getSeasons()`, `getSeasonWithMatchdays(seasonId)`, `getMatchdays(seasonId)`
- `createSeason(formData)`, `createMatchday(formData)`
- `getVenues()`, `createVenue(formData)`

## 3. Current Input/Output Contract Pattern

### Create/Update Actions
- Input: `FormData`
- Validation: done in action
- Success result: `{ success: true }`
- Validation failure: `{ error: string }`
- UI behavior: calling page redirects back with `?error=...` and shows `FormErrorAlert`

### Query/List Actions
- Input: optional primitive filters
- Output: Prisma result objects with selected relations

## 4. Planned Public REST API (Backlog)

The following endpoint groups remain planned, based on the product documentation:
- `/api/auth/*`
- `/api/seasons/*`, `/api/matchdays/*`, `/api/venues/*`
- `/api/teams/*`, `/api/players/*`, `/api/referees/*`, `/api/matches/*`
- `/api/matches/:id/lineups`, `/substitutions`, `/cards`, `/referee-report`, `/uploads`
- `/api/exports/*`, `/api/search/*`
