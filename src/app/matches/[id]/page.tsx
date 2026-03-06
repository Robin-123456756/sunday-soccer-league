import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatchById } from "@/server/actions/matches";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchDetailPage({
  params,
}: MatchDetailPageProps) {
  const { id } = await params;
  const match = await getMatchById(id);

  if (!match) {
    notFound();
  }

  const matchDateFormatted = new Date(match.matchDate).toLocaleDateString(
    undefined,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${match.homeTeam.name} vs ${match.awayTeam.name}`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/matches"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to Matches
            </Link>
            <Link
              href={`/matches/${match.id}/edit`}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Edit
            </Link>
          </div>
        }
      />

      {/* Score & Status Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-center">
            <div className="min-w-[120px]">
              <p className="text-lg font-semibold text-gray-900">
                {match.homeTeam.name}
              </p>
              {match.homeTeam.shortName && (
                <p className="text-sm text-gray-500">
                  {match.homeTeam.shortName}
                </p>
              )}
            </div>

            {match.homeScore !== null && match.awayScore !== null ? (
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {match.homeScore} - {match.awayScore}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">vs</p>
              </div>
            )}

            <div className="min-w-[120px]">
              <p className="text-lg font-semibold text-gray-900">
                {match.awayTeam.name}
              </p>
              {match.awayTeam.shortName && (
                <p className="text-sm text-gray-500">
                  {match.awayTeam.shortName}
                </p>
              )}
            </div>
          </div>

          <StatusBadge status={match.status} />

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>{matchDateFormatted}</span>
            {match.kickoffTime && <span>Kickoff: {match.kickoffTime}</span>}
            {match.venue && <span>{match.venue.name}</span>}
          </div>
        </div>
      </div>

      {/* Match Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Match Information
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Jersey Colors */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Jersey Colors</dt>
            <dd className="mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-5 w-5 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: match.homeJerseyColor ?? "#cccccc",
                  }}
                />
                <span className="text-sm text-gray-700">
                  {match.homeTeam.shortName ?? "Home"}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="inline-block h-5 w-5 rounded-full border border-gray-300"
                  style={{
                    backgroundColor: match.awayJerseyColor ?? "#cccccc",
                  }}
                />
                <span className="text-sm text-gray-700">
                  {match.awayTeam.shortName ?? "Away"}
                </span>
              </span>
            </dd>
          </div>

          {/* Referee */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Referee</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {match.referee?.fullName ?? "Not assigned"}
            </dd>
          </div>

          {/* Season */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Season</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {match.season?.name ?? "Not assigned"}
            </dd>
          </div>

          {/* Matchday */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Matchday</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {match.matchday?.name ?? "Not assigned"}
            </dd>
          </div>

          {/* Venue */}
          {match.venue && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Venue</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {match.venue.name}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Phase 1 Notice */}
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">
          Lineups, cards, substitutions, and match reports will be available in a
          future update.
        </p>
      </div>
    </div>
  );
}
