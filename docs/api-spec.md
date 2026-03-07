# API Specification

## Matches
- `POST /api/matches` create match
- `GET /api/matches` list matches
- `GET /api/matches/:id` get match details
- `PATCH /api/matches/:id` update match

## Lineups
- `POST /api/matches/:id/lineups` save lineup
- `GET /api/matches/:id/lineups` get lineups

## Substitutions
- `POST /api/matches/:id/substitutions` record substitution
- `GET /api/matches/:id/substitutions` list substitutions

## Cards
- `POST /api/matches/:id/cards` record card event
- `GET /api/matches/:id/cards` list card events

## Referee Reports
- `POST /api/matches/:id/referee-report` submit report
- `GET /api/matches/:id/referee-report` get report

## Uploads
- `POST /api/matches/:id/uploads/team-sheet` upload file
- `GET /api/matches/:id/uploads` list files

## Exports
- `GET /api/exports/players.csv` export player data as CSV
- `GET /api/exports/players.xlsx` export player data as Excel
- `POST /api/exports/generate` create export job
