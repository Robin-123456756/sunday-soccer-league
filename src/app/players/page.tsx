import Link from "next/link";
import { getPlayers } from "@/server/actions/players";
import { getTeams } from "@/server/actions/teams";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

interface PlayersPageProps {
  searchParams: Promise<{ teamId?: string }>;
}

export default async function PlayersPage({ searchParams }: PlayersPageProps) {
  const { teamId } = await searchParams;
  const [players, teams] = await Promise.all([
    getPlayers(teamId),
    getTeams(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Players"
        action={
          <Link
            href="/players/create"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add Player
          </Link>
        }
      />

      {/* Team Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="teamFilter" className="text-sm font-medium text-gray-700">
          Filter by team:
        </label>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/players"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              !teamId
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </Link>
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/players?teamId=${team.id}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                teamId === team.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {team.name}
            </Link>
          ))}
        </div>
      </div>

      {players.length === 0 ? (
        <EmptyState
          title="No players found"
          description={
            teamId
              ? "No players found for the selected team."
              : "Get started by adding your first player."
          }
          action={
            <Link
              href="/players/create"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Player
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Team
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Jersey #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reg Number
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Link
                      href={`/players/${player.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {player.fullName}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {player.team?.name ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {player.jerseyNumber ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {player.position ?? "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {player.registrationNumber ?? "-"}
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
