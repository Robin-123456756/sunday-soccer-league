export const dynamic = "force-dynamic";
import Link from "next/link";
import { getMatches } from "@/server/actions/matches";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";

interface MatchesPageProps {
  searchParams: Promise<{ seasonId?: string; teamId?: string; status?: string }>;
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const { seasonId, teamId, status } = await searchParams;
  const matches = await getMatches({ seasonId, teamId, status });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matches"
        action={
          <Link
            href="/matches/create"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Create Fixture
          </Link>
        }
      />

      {matches.length === 0 ? (
        <EmptyState
          title="No matches yet"
          description="Get started by creating your first fixture."
          action={
            <Link
              href="/matches/create"
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Create Fixture
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Match
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Venue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Referee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {matches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {new Date(match.matchDate).toLocaleDateString()}
                    {match.kickoffTime && (
                      <span className="ml-1 text-gray-400">
                        {match.kickoffTime}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Link
                      href={`/matches/${match.id}`}
                      className="font-medium text-green-600 hover:text-green-800 hover:underline"
                    >
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {match.venue?.name ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {match.referee?.fullName ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <StatusBadge status={match.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {match.status === "completed" &&
                    match.homeScore !== null &&
                    match.awayScore !== null
                      ? `${match.homeScore} - ${match.awayScore}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
