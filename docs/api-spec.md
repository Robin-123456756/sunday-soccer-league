# API Specification

All endpoints are under `/api`. Authentication is required unless noted otherwise.

## Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout current session
- `GET /api/auth/me` - Get current user info

## Seasons
- `POST /api/seasons` - Create season (admin)
- `GET /api/seasons` - List all seasons
- `GET /api/seasons/:id` - Get season details
- `PATCH /api/seasons/:id` - Update season (admin)

## Matchdays
- `POST /api/seasons/:seasonId/matchdays` - Create matchday (admin)
- `GET /api/seasons/:seasonId/matchdays` - List matchdays in a season
- `PATCH /api/matchdays/:id` - Update matchday (admin)

## Venues
- `POST /api/venues` - Create venue (admin)
- `GET /api/venues` - List all venues
- `PATCH /api/venues/:id` - Update venue (admin)

## Teams
- `POST /api/teams` - Create team (admin)
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team details with players
- `PATCH /api/teams/:id` - Update team (admin)

## Players
- `POST /api/players` - Create player (admin)
- `GET /api/players` - List players (filterable by team)
- `GET /api/players/:id` - Get player details with history
- `PATCH /api/players/:id` - Update player (admin)

## Referees
- `POST /api/referees` - Create referee (admin)
- `GET /api/referees` - List all referees
- `GET /api/referees/:id` - Get referee details
- `PATCH /api/referees/:id` - Update referee (admin)

## Matches
- `POST /api/matches` - Create match fixture (admin)
- `GET /api/matches` - List matches (filterable by season, matchday, team, status, date range)
- `GET /api/matches/:id` - Get full match details (lineups, cards, subs, report, uploads)
- `PATCH /api/matches/:id` - Update match details (admin)

## Lineups
- `POST /api/matches/:matchId/lineups` - Submit lineup for a team (team manager)
- `GET /api/matches/:matchId/lineups` - Get lineups for a match
- `GET /api/matches/:matchId/lineups/:teamId` - Get lineup for a specific team

## Substitutions
- `POST /api/matches/:matchId/substitutions` - Record a substitution (referee/admin)
- `GET /api/matches/:matchId/substitutions` - Get all substitutions for a match

## Cards
- `POST /api/matches/:matchId/cards` - Record a card event (referee/admin)
- `GET /api/matches/:matchId/cards` - Get all card events for a match
- `GET /api/cards` - List all cards (filterable by player, team, type, date range)

## Referee Reports
- `POST /api/matches/:matchId/referee-report` - Submit referee report (referee)
- `GET /api/matches/:matchId/referee-report` - Get referee report for a match
- `PATCH /api/matches/:matchId/referee-report` - Update referee report (referee/admin)

## Team Sheet Uploads
- `POST /api/matches/:matchId/uploads/team-sheet` - Upload team sheet image (team manager/admin)
- `GET /api/matches/:matchId/uploads` - List uploaded files for a match
- `GET /api/uploads/:id/download` - Download a specific upload
- `DELETE /api/uploads/:id` - Delete an upload (admin)

## Exports
- `GET /api/exports/players?format=csv&teamId=...&seasonId=...` - Export player data
- `GET /api/exports/discipline?format=xlsx&playerId=...&cardType=...` - Export discipline data
- `GET /api/exports/appearances?format=csv&playerId=...&seasonId=...` - Export appearance data
- `POST /api/exports/generate` - Create async export job for large reports
- `GET /api/exports/:jobId` - Check export job status / download

## Search
- `GET /api/search/matches?q=...&team=...&referee=...&from=...&to=...` - Search match records
- `GET /api/search/players?q=...&team=...` - Search players
- `GET /api/search/cards?player=...&team=...&type=...&from=...&to=...` - Search card events

## Common Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field
- `order` - Sort order (asc/desc)

## Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Home team and away team cannot be the same"
  }
}
```
