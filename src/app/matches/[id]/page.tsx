import Link from 'next/link';
import {
  cardStyle,
  gridStyle,
  mutedTextStyle,
  pageStyle,
  secondaryButtonStyle,
  sectionTitleStyle,
} from '@/components/ui/styles';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { RecordScoreForm } from '@/components/forms/RecordScoreForm';
import { requireSignedInPage } from '@/server/queries/auth';
import { getMatchCardEvents, getMatchDetails, getMatchReport, getMatchSubstitutions, getMatchUploads } from '@/server/queries/matches';

export default async function MatchOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireSignedInPage();
  const { id } = await params;
  const match = await getMatchDetails(id);
  const [cards, substitutions, uploads, report] = await Promise.all([
    getMatchCardEvents(id),
    getMatchSubstitutions(id),
    getMatchUploads(id),
    getMatchReport(id, match.referee?.id ?? null),
  ]);

  return (
    <main className="page-main" style={pageStyle}>
      <div className="page-container" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 20 }}>
        <div>
          <Breadcrumbs items={[{ label: 'Matches', href: '/matches' }, { label: `${match.home_team?.name} vs ${match.away_team?.name}` }]} />
          <h1 style={{ marginBottom: 8 }}>{match.home_team?.name} vs {match.away_team?.name}</h1>
          <p style={mutedTextStyle}>{match.match_date} {"\u00b7"}{match.kickoff_time ?? 'Time TBD'} {"\u00b7"}{match.venue ?? 'Venue TBD'}</p>
        </div>

        <div style={gridStyle}>
          <InfoCard title="Status" value={match.status} helper={`Referee: ${match.referee?.full_name ?? 'Not assigned'}`} />
          <InfoCard title="Score" value={`${match.home_score ?? 0} - ${match.away_score ?? 0}`} helper={match.status === 'completed' ? 'Full time' : 'Match not yet completed'} />
          <InfoCard title="Jerseys" value={`${match.home_jersey_color ?? '\u2014'} / ${match.away_jersey_color ?? '\u2014'}`} helper="Home / Away colors" />
          <InfoCard title="Records" value={`${cards.length} cards {"\u00b7"}${substitutions.length} subs {"\u00b7"}${uploads.length} uploads`} helper={report ? 'Referee report submitted' : 'No referee report yet'} />
        </div>

        <div className="action-buttons" style={{ ...cardStyle, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href={`/matches/${id}/lineups`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Open lineups</Link>
          <Link href={`/matches/${id}/substitutions`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Open substitutions</Link>
          <Link href={`/matches/${id}/cards`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Open cards</Link>
          <Link href={`/matches/${id}/referee-report`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Open referee report</Link>
          <Link href={`/matches/${id}/uploads`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>Open uploads</Link>
        </div>

        {(profile.role === 'admin' || profile.role === 'referee') ? (
          <RecordScoreForm
            matchId={id}
            homeTeamName={match.home_team?.name ?? 'Home'}
            awayTeamName={match.away_team?.name ?? 'Away'}
            initialHomeScore={match.home_score}
            initialAwayScore={match.away_score}
            currentStatus={match.status}
          />
        ) : null}

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Substitutions</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {substitutions.length === 0 ? (
              <p style={mutedTextStyle}>No substitutions recorded for this match yet.</p>
            ) : (
              substitutions.map((sub) => (
                <div key={sub.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 10 }}>
                  <strong>{sub.minute}&apos;</strong>{' '}
                  <span style={{ color: '#b91c1c' }}>{sub.player_off?.full_name ?? 'Unknown'}</span>
                  {" \u2192 "}
                  <span style={{ color: '#047857' }}>{sub.player_on?.full_name ?? 'Unknown'}</span>
                  <p style={{ ...mutedTextStyle, marginTop: 4 }}>
                    {sub.team?.name ?? 'Unknown team'}
                    {sub.reason ? ` {"\u00b7"}${sub.reason}` : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Card events</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {cards.length === 0 ? (
                <p style={mutedTextStyle}>No cards recorded for this match yet.</p>
              ) : (
                cards.map((card) => (
                  <div key={card.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 10 }}>
                    <strong>{card.player?.full_name ?? 'Unknown player'}</strong>
                    <p style={{ ...mutedTextStyle, marginTop: 4 }}>
                      {card.team?.name ?? 'Unknown team'} {"\u00b7"}{card.card_type} {"\u00b7"}{card.minute}&apos;
                    </p>
                    <p style={{ ...mutedTextStyle, marginTop: 4 }}>{card.reason}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Uploads</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {uploads.length === 0 ? (
                <p style={mutedTextStyle}>No team sheets uploaded yet.</p>
              ) : (
                uploads.map((upload) => (
                  <div key={upload.id} style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: 10 }}>
                    <strong>{upload.team?.name ?? 'Team sheet'}</strong>
                    <p style={{ ...mutedTextStyle, marginTop: 4 }}>{upload.file_name}</p>
                    <a href={upload.file_url} target="_blank" rel="noreferrer">Open file</a>
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

function InfoCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <div style={cardStyle}>
      <p style={{ ...mutedTextStyle, marginBottom: 8 }}>{title}</p>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{value}</div>
      <p style={mutedTextStyle}>{helper}</p>
    </div>
  );
}
