# Database Schema

## Core Entities
- Team
- Player
- Referee
- Matchday
- Match
- MatchLineup
- Substitution
- CardEvent
- RefereeReport
- TeamSheetUpload
- ExportJob

## Key Relationships
- A Team has many Players.
- A Match belongs to one home Team and one away Team.
- A Match has many MatchLineup rows.
- A Match has many Substitutions.
- A Match has many CardEvents.
- A Match has one RefereeReport.
- A Match has many TeamSheetUploads.

## Important Rules
- Home team and away team cannot be the same.
- A player cannot be listed as both starter and bench in the same match.
- A substitution must use players from the same team.
- Card events must reference a valid match and player.
