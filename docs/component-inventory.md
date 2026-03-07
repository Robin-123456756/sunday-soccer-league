# Component Inventory

## Layout Components
- `src/components/ui/sidebar.tsx`: primary app navigation
- `src/app/layout.tsx`: global shell (sidebar + content)

## Page Structure Components
- `src/components/ui/page-header.tsx`: title, description, action slot
- `src/components/ui/empty-state.tsx`: no-data state with optional CTA
- `src/components/ui/form-error-alert.tsx`: validation feedback banner

## Form Components
- `src/components/ui/form-field.tsx`: label wrapper and input/select utility
- `src/components/ui/submit-button.tsx`: pending-aware submit button
- `src/components/ui/delete-button.tsx`: delete action with confirmation

## Domain Form Components
- `src/app/teams/_components/team-form.tsx`
- `src/app/players/_components/player-form.tsx`
- `src/app/referees/_components/referee-form.tsx`
- `src/app/matches/_components/match-form.tsx`
- `src/components/forms/CreateMatchForm.tsx`
- `src/components/forms/SaveLineupForm.tsx`
- `src/components/forms/RecordCardForm.tsx`
- `src/components/forms/RefereeReportForm.tsx`
- `src/components/forms/TeamSheetUploadForm.tsx`

## Data Display Components
- `src/components/ui/status-badge.tsx`: match status pill styles

## Page Modules
- Dashboard module
- Teams CRUD module
- Players CRUD module
- Referees CRUD module
- Matches CRUD module

## Planned Components (Backlog)
- Lineup editor and roster picker
- Substitution timeline
- Card event panel
- Referee report form module
- Upload manager and preview pane
- Export filters and job status panel
