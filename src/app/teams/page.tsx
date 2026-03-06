export const dynamic = "force-dynamic";
import Link from "next/link";
import { getTeams } from "@/server/actions/teams";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        action={
          <Link
            href="/teams/create"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Team
          </Link>
        }
      />

      {teams.length === 0 ? (
        <EmptyState
          title="No teams yet"
          description="Get started by creating your first team."
          action={
            <Link
              href="/teams/create"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Team
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span
                    className="inline-block h-6 w-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: team.primaryColor ?? "#cccccc" }}
                  />
                  <span
                    className="inline-block h-6 w-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: team.secondaryColor ?? "#ffffff" }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.name}
                  </h3>
                  {team.shortName && (
                    <p className="text-sm text-gray-500">{team.shortName}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>{team._count?.players ?? 0} players</span>
                {team.homeVenue && <span>{team.homeVenue.name}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
