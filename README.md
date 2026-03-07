# Sunday Soccer League Matchday System

A web system for managing Sunday soccer league operations, including fixtures, teams, players, referees, and match records.

## Current Features
- Dashboard with operational KPIs and recent matches
- Teams CRUD (create, view, edit, deactivate)
- Players CRUD with team filtering
- Referees CRUD
- Matches CRUD with status badges and fixture editing
- Server-side form validation with in-page error feedback

## Planned Features
- Lineups, substitutions, cards, and referee reporting workflows
- Team sheet upload workflow
- Reporting and export center
- Role-based authentication and permissions

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Supabase-compatible)

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A PostgreSQL connection string

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your values (at minimum `DATABASE_URL`)
4. Run the app:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`

## Documentation
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

## Project Structure
```txt
sunday-soccer-league/
|-- docs/
|-- prisma/
|-- src/
|   |-- app/
|   |-- components/
|   |-- lib/
|   `-- types/
|-- package.json
`-- README.md
```
