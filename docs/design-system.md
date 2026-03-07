# Design System

## Visual Direction
Pragmatic admin interface with neutral backgrounds, high-contrast text, and color-coded actions.

## Color Roles (Current)
- Primary action: green (`bg-green-600`, hover `bg-green-700`)
- Secondary action: gray neutral buttons
- Danger action: red (`bg-red-600`, hover `bg-red-700`)
- Informational surfaces: white cards on light gray page background
- Match status badges:
  - scheduled: blue
  - in_progress: yellow
  - completed: green
  - postponed: red

## Typography
- Heading hierarchy:
  - Page title: `text-2xl font-bold`
  - Section title: `text-lg font-semibold`
  - Body text: `text-sm`
- Font stack:
  - Geist variables are configured in layout
  - Global fallback currently uses Arial/Helvetica in `globals.css`

## Spacing and Layout
- App shell: left sidebar + content region
- Content spacing: `p-8` with section gaps (`space-y-6`)
- Card style: rounded corners, light border, subtle shadow

## Shared UI Primitives
- `PageHeader`
- `FormField`
- `SubmitButton`
- `DeleteButton`
- `EmptyState`
- `StatusBadge`
- `FormErrorAlert`

## Interaction Rules
- Keep destructive actions explicit and confirm before deletion
- Keep primary action placement consistent (top-right in page header)
- Use shared button styles instead of per-page one-off variants
- Revalidate affected routes after mutations to avoid stale UI

## Planned Enhancements
- Define centralized semantic color tokens in CSS variables
- Add mobile nav treatment for sidebar
- Add component states documentation (hover, focus, disabled, loading)
