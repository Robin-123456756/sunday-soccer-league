# Wireframes

## Dashboard
- Left: persistent sidebar navigation
- Main top: page title and KPI cards row
- Main middle: recent matches panel
- Main right/bottom: quick actions panel

## Entity List Screens (Teams, Players, Referees, Matches)
- Header row with page title + create action
- Optional filters (for players and matches)
- Primary content area as table or cards
- Empty state block when no records exist

## Entity Detail Screens
- Header with title and edit/delete actions
- Metadata summary section
- Related data section (for example team roster, match info)
- Placeholder section for future modules where not yet implemented

## Form Screens (Create/Edit)
- Single-column card container
- Grouped fields using shared `FormField` pattern
- Bottom action row: cancel + submit
- Error alert above form when server validation fails

## Planned Match Workspace (Future)
- Header: teams, score, status, venue, date
- Tabs or segmented sections:
  - Overview
  - Lineups
  - Substitutions
  - Cards
  - Referee report
  - Uploads
