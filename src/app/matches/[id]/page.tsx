import Link from "next/link";
import {
  cardStyle,
  gridStyle,
  mutedTextStyle,
  pageStyle,
  secondaryButtonStyle,
  sectionTitleStyle,
} from "@/components/ui/styles";
import {
  getMatchCardEvents,
  getMatchDetails,
  getMatchReport,
  getMatchUploads,
} from "@/server/queries/matches";

export default async function MatchOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: matchId } = await params;
  const match = await getMatchDetails(matchId);
  const [cards, uploads, report] = await Promise.all([
    getMatchCardEvents(matchId),
    getMatchUploads(matchId),
    getMatchReport(matchId, match.referee?.id ?? null),
  ]);

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 20 }}>
        <div>
          <Link href="/matches">{"<-"} Back to matches</Link>
          <h1 style={{ marginBottom: 8 }}>
            {match.home_team?.name} vs {match.away_team?.name}
          </h1>
          <p style={mutedTextStyle}>
            {match.match_date} | {match.kickoff_time ?? "Time TBD"} |{" "}
            {match.venue ?? "Venue TBD"}
          </p>
        </div>

        <div style={gridStyle}>
          <InfoCard
            title="Status"
            value={match.status}
            helper={`Referee: ${match.referee?.full_name ?? "Not assigned"}`}
          />
          <InfoCard
            title="Score"
            value={`${match.home_score ?? 0} - ${match.away_score ?? 0}`}
            helper="Update result handling later if needed"
          />
          <InfoCard
            title="Jerseys"
            value={`${match.home_jersey_color ?? "-"} / ${match.away_jersey_color ?? "-"}`}
            helper="Home / Away colors"
          />
          <InfoCard
            title="Records"
            value={`${cards.length} cards | ${uploads.length} uploads`}
            helper={report ? "Referee report submitted" : "No referee report yet"}
          />
        </div>

        <div style={{ ...cardStyle, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href={`/matches/${matchId}/lineups`}
            style={{ ...secondaryButtonStyle, textDecoration: "none" }}
          >
            Open lineups
          </Link>
          <Link
            href={`/matches/${matchId}/cards`}
            style={{ ...secondaryButtonStyle, textDecoration: "none" }}
          >
            Open cards
          </Link>
          <Link
            href={`/matches/${matchId}/referee-report`}
            style={{ ...secondaryButtonStyle, textDecoration: "none" }}
          >
            Open referee report
          </Link>
          <Link
            href={`/matches/${matchId}/uploads`}
            style={{ ...secondaryButtonStyle, textDecoration: "none" }}
          >
            Open uploads
          </Link>
        </div>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Card events</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {cards.length === 0 ? (
                <p style={mutedTextStyle}>No cards recorded for this match yet.</p>
              ) : (
                cards.map((card) => (
                  <div
                    key={card.id}
                    style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 10 }}
                  >
                    <strong>{card.player?.full_name ?? "Unknown player"}</strong>
                    <p style={{ ...mutedTextStyle, marginTop: 4 }}>
                      {card.team?.name ?? "Unknown team"} | {card.card_type} |{" "}
                      {card.minute}'
                    </p>
                    <p style={{ ...mutedTextStyle, marginTop: 4 }}>{card.reason}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Uploads</h2>
            <div style={{ display: "grid", gap: 10 }}>
              {uploads.length === 0 ? (
                <p style={mutedTextStyle}>No team sheets uploaded yet.</p>
              ) : (
                uploads.map((upload) => (
                  <div
                    key={upload.id}
                    style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 10 }}
                  >
                    <strong>{upload.team?.name ?? "Team sheet"}</strong>
                    <p style={{ ...mutedTextStyle, marginTop: 4 }}>
                      {upload.file_name}
                    </p>
                    <a href={upload.file_url} target="_blank" rel="noreferrer">
                      Open file
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div style={cardStyle}>
      <p style={{ ...mutedTextStyle, marginBottom: 8 }}>{title}</p>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{value}</div>
      <p style={mutedTextStyle}>{helper}</p>
    </div>
  );
}
