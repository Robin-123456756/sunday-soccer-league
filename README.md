# Sunday Soccer League Matchday System

A starter project for recording Sunday soccer league matchday operations, including fixtures, lineups, substitutions, cards, referee reports, team sheet uploads, and player data exports.

## Core Features
- Match creation and scheduling
- Home and away team tracking
- Jersey color tracking
- Starting XI and bench recording
- Substitution recording
- Card and caution reason tracking
- Referee assignment and reporting
- Team sheet image upload and storage
- Historical search and retrieval
- CSV and Excel export for player-related data

## Users
- League Admin
- Referee
- Team Manager / Team Official

## Suggested Stack
- Next.js 15+
- TypeScript
- Prisma
- PostgreSQL or Supabase Postgres
- Supabase Storage or S3-compatible storage
- Tailwind CSS
- xlsx for Excel export
- papaparse or native CSV generation

## Project Structure
```txt
sunday-soccer-league-starter/
├── README.md
├── package.json
├── .env.example
├── docs/
├── prisma/
└── src/
```

## Setup
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Environment Variables
See `.env.example`.

## Main Deliverables in This Starter
- Product and UX markdown documentation
- Prisma schema
- TypeScript domain types
- File upload utility
- CSV / Excel export utility
- Minimal export page scaffold

## Future Build Order
1. Auth and RBAC
2. Team and player management
3. Match setup
4. Lineup submission
5. Card events and referee reports
6. Team sheet uploads
7. Search and exports

## Notes
This starter focuses on foundation files and build direction. It is intentionally lean so you can adapt it to your exact league workflow.


## Supabase SQL
The project now includes `supabase/schema.sql` so you can create the database directly in Supabase SQL Editor.
