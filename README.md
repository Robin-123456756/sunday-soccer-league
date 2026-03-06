# Sunday Soccer League Matchday System

A digital system for recording Sunday soccer league matchday information, including lineups, substitutions, cards, referee reports, jersey colors, home/away designation, and uploaded team sheets.

## Features
- Match creation and scheduling
- Home and away team tracking with jersey colors
- Referee assignment and reporting
- Starting XI and bench recording
- Substitution tracking
- Card and caution reason tracking
- Referee observations and match comments
- Team sheet image upload and storage
- Historical access to match records
- CSV and Excel export of player data

## Main Users
- **League Admin** - Full system management
- **Referee** - Match reports, cards, observations
- **Team Manager** - Lineups, team sheet uploads

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- [Prisma](https://www.prisma.io/) ORM
- Supabase Auth & Storage

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A Supabase project (or local PostgreSQL)

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your Supabase/database credentials
5. Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
6. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```
7. Start the development server:
   ```bash
   npm run dev
   ```
8. Open [http://localhost:3000](http://localhost:3000)

## Project Structure
```
sunday-soccer-league/
├── docs/                    # System documentation
│   ├── system-overview.md
│   ├── requirements.md
│   ├── user-flows.md
│   ├── database-schema.md
│   ├── api-spec.md
│   └── referee-report-format.md
├── prisma/
│   └── schema.prisma        # Database schema
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities (db, auth, storage, validation)
│   └── types/               # TypeScript type definitions
└── public/
```

## Core Modules
- Authentication & Role-based Access
- League Management (Teams, Players, Referees, Seasons, Venues)
- Match Management (Fixtures, Lineups, Results)
- Discipline Tracking (Cards, Caution Reasons)
- Referee Reporting
- Media Uploads (Team Sheet Images)
- Data Export (CSV, Excel)

## Build Phases
1. Teams, Players, Referees, Fixtures
2. Lineups, Bench, Home/Away, Jersey Colors
3. Cards, Caution Reasons, Referee Reports
4. Team Sheet Image Upload, Historical Search
5. Reports, Exports, Discipline Automation
