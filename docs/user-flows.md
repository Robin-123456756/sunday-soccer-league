# User Flows

## Implemented Flows (Current App)

### 1. Admin Dashboard Entry
1. User opens `/`
2. System redirects to `/dashboard`
3. Dashboard shows counts for teams, players, referees, and matches
4. User follows quick actions to create records

### 2. Team Management
1. Admin opens `/teams`
2. Admin selects `Create Team`
3. Admin submits team form with name/colors/venue
4. On success system redirects to `/teams`
5. Admin can open team detail, edit, or deactivate

### 3. Player Management
1. Admin opens `/players`
2. Admin optionally filters by team
3. Admin selects `Add Player`
4. Admin submits player form with team assignment
5. Admin can open player detail, edit, or deactivate

### 4. Referee Management
1. Admin opens `/referees`
2. Admin selects `Add Referee`
3. Admin submits referee profile form
4. Admin can open referee detail, edit, or deactivate

### 5. Fixture Management
1. Admin opens `/matches`
2. Admin selects `Create Fixture`
3. Admin selects teams, date, venue, referee, and season
4. System validates that home and away teams differ
5. Admin can open match detail and edit fixture metadata/status

### 6. Validation Error Loop
1. User submits invalid form data
2. Server action returns `{ error: "..." }`
3. User is redirected back to the same form with `?error=...`
4. Form page displays `FormErrorAlert` with the error message

## Planned Flows (Documented Scope)

### 7. Team Lineup Submission
1. Team manager opens assigned fixture
2. Team manager selects starters and bench
3. Team manager sets captain
4. System validates team-player ownership and duplicate rules

### 8. Referee Match Reporting
1. Referee opens assigned match
2. Referee records cards/substitutions
3. Referee submits structured observations
4. Report becomes visible to admin

### 9. Upload and Export
1. Team manager uploads team sheet image/PDF
2. Admin accesses historical uploads
3. Admin exports player/discipline/appearance data as CSV or XLSX
