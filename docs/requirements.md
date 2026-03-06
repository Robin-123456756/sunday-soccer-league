# Requirements

## Functional Requirements

### League Management
1. The system must allow admins to create, edit, and deactivate teams.
2. The system must allow admins to create, edit, and deactivate players linked to teams.
3. The system must allow admins to create, edit, and deactivate referees.
4. The system must allow admins to create and manage seasons.
5. The system must allow admins to create and manage matchdays/rounds within a season.
6. The system must allow admins to create and manage venues.

### Match Management
7. The system must allow admins to create fixtures with home/away teams, venue, date, kickoff time, and referee assignment.
8. The system must store jersey colors for both home and away teams per match.
9. The system must support match statuses: scheduled, in progress, completed, postponed.
10. The system must record final scores for completed matches.

### Lineup Recording
11. The system must allow team managers to submit starting XI and bench players for each match.
12. The system must allow designation of a team captain per match.
13. Only players registered to a team can be selected for that team's lineup.
14. A player cannot be both a starter and a bench player in the same match.

### Substitutions
15. The system must record substitutions with player off, player on, minute, and optional reason.
16. Substitution players must belong to the same team.

### Discipline
17. The system must record card events (yellow, red, second yellow leading to red).
18. Each card must capture: player, team, card type, minute, reason, and optional referee note.
19. Card events must reference a valid player in the match.
20. The system must track repeat offenders across matches.

### Referee Reporting
21. Referees must be able to submit match reports with: general comment, time management, dress code, organization, conduct, and incident observations.
22. A referee report must be linked to a specific match.
23. Referees can only submit reports for matches they are assigned to.

### Team Sheet Uploads
24. Team managers must be able to upload scanned/photographed team sheet images (image or PDF).
25. Uploads must be associated with a specific match and team.
26. Uploaded files must be viewable and downloadable.
27. Uploads must be permanently stored for historical access.

### Search and History
28. Admins must be able to search match records by: matchday, team, player, referee, card type, date range.
29. All match records must remain historically accessible.

### Data Export
30. The system must support exporting player data in CSV and Excel (.xlsx) formats.
31. Exports must be available for: player registration details, team player lists, matchday squad lists, card/discipline history, appearance history, match participation.
32. Exports must be filterable by: team, player, season, matchday, date range, card type.

## Non-Functional Requirements

1. **Usability**: The system must be simple enough for non-technical league officials to use without training.
2. **Responsiveness**: The system must be fully usable on mobile phones and tablets.
3. **Security**: Uploaded images must be securely stored with access control.
4. **Authorization**: Access must be role-based (admin, referee, team manager).
5. **Data Integrity**: Required matchday inputs must be validated before submission.
6. **Reliability**: Match records must be durable and not subject to accidental deletion.
7. **Performance**: Search and filtering operations must return results within 2 seconds for typical dataset sizes.

## Validation Rules
- Home team and away team cannot be the same.
- A player cannot be both starter and bench in the same match.
- Only players belonging to a team can be selected for that team's lineup.
- A substitution must reference one player off and one player on from the same team.
- Card events must reference a valid player participating in the match.
- Team sheet uploads must be image (JPEG, PNG) or PDF files only.
- Referee report cannot be submitted without a linked match.
