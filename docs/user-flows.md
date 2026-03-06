# User Flows

## 1. Admin Flows

### 1.1 Initial League Setup
1. Admin logs in with admin credentials
2. Admin creates a new season (e.g., "2026 Spring Season")
3. Admin creates venues (e.g., "City Park Field A")
4. Admin creates teams with name and primary/secondary colors
5. Admin registers players under each team (name, jersey number, position, DOB)
6. Admin creates referees (name, contact, level)

### 1.2 Create a Match Fixture
1. Admin navigates to Matches > Create Fixture
2. Admin selects season and matchday/round
3. Admin selects home team and away team
4. Admin sets match date and kickoff time
5. Admin selects venue
6. Admin sets home jersey color and away jersey color
7. Admin assigns a referee (and optional assistant referees)
8. Match is saved with status "scheduled"

### 1.3 Review Match Records
1. Admin navigates to Matches > Match List
2. Admin filters by date range, team, or matchday
3. Admin selects a match to view full details
4. Admin sees: lineups, substitutions, cards, referee report, uploaded team sheets
5. Admin can edit match details or update the score and status

### 1.4 Review Discipline Records
1. Admin navigates to Discipline section
2. Admin filters cards by player, team, card type, or date range
3. Admin views card history and identifies repeat offenders
4. Admin can generate discipline summary reports

### 1.5 Export Data
1. Admin navigates to Reports > Exports
2. Admin selects export type (player details, discipline report, appearances, etc.)
3. Admin applies filters (team, season, date range, etc.)
4. Admin selects format (CSV or Excel)
5. System generates and downloads the file

---

## 2. Referee Flows

### 2.1 View Assigned Matches
1. Referee logs in
2. Referee sees dashboard with upcoming assigned matches
3. Referee selects a match to view details (teams, venue, kickoff time)

### 2.2 Record Match Events (During Match)
1. Referee opens the active match
2. Referee records card events as they happen:
   - Select player and team
   - Select card type (yellow/red/second yellow)
   - Enter minute
   - Select or enter reason
   - Add optional note
3. Referee can also record substitution events if needed

### 2.3 Submit Match Report (Post-Match)
1. Referee opens the completed match
2. Referee fills in the report form:
   - General match comment
   - Time management observations
   - Dress code observations
   - Organization observations
   - Team conduct observations
   - Additional incidents
3. Referee submits the report
4. Report is linked to the match and visible to admins

---

## 3. Team Manager Flows

### 3.1 Submit Team Lineup
1. Team manager logs in
2. Team manager sees upcoming fixtures for their team
3. Team manager selects a fixture
4. Team manager picks 11 starters from the team roster
5. Team manager picks bench players from remaining roster
6. Team manager designates a captain
7. Team manager submits the lineup

### 3.2 Upload Team Sheet Image
1. Team manager opens a fixture
2. Team manager clicks "Upload Team Sheet"
3. Team manager selects an image or PDF file from their device
4. System uploads and associates the file with the match and team
5. Confirmation is shown with a preview of the uploaded file

### 3.3 Review Previous Team Sheets
1. Team manager navigates to match history
2. Team manager selects a past match
3. Team manager views or downloads previously uploaded team sheets
