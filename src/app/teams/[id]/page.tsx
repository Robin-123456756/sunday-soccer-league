export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTeamById } from "@/server/actions/teams";
import { archiveTeam as deleteTeam } from "@/server/actions/archive";
import { PageHeader } from "@/components/ui/page-header";
import { DeleteButton } from "@/components/ui/delete-button";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { withErrorQuery } from "@/lib/url";

interface TeamDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function TeamDetailPage({
  params,
  searchParams,
}: TeamDetailPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const team = await getTeamById(id);

  if (!team) {
    notFound();
  }

  async function handleDeleteTeam() {
    "use server";
    try {
      await deleteTeam(id);
    } catch (err) {
      redirect(withErrorQuery(`/teams/${id}`, err instanceof Error ? err.message : "Could not archive team."));
    }
    redirect("/teams");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={team.name}
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/teams/${team.id}/edit`}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Edit
            </Link>
            <DeleteButton action={handleDeleteTeam} />
          </div>
        }
      />
      <FormErrorAlert message={error} />

      {/* Team Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Team Information
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{team.name}</dd>
          </div>
          {team.shortName && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Short Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{team.shortName}</dd>
            </div>
          )}
          {team.homeVenue && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Home Venue</dt>
              <dd className="mt-1 text-sm text-gray-900">{team.homeVenue}</dd>
            </div>
          )}
          <div>
            <dt className="mb-1 text-sm font-medium text-gray-500">Colors</dt>
            <dd className="flex items-center gap-2">
              {team.primaryColor && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-5 w-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: team.primaryColor }}
                  />
                  <span className="text-sm text-gray-700">Primary</span>
                </span>
              )}
              {team.secondaryColor && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-5 w-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: team.secondaryColor }}
                  />
                  <span className="text-sm text-gray-700">Secondary</span>
                </span>
              )}
              {!team.primaryColor && !team.secondaryColor && (
                <span className="text-sm text-gray-400">Not set</span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Player Roster */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Player Roster
        </h2>
        {team.players && team.players.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Jersey #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {team.players.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {player.fullName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {player.jerseyNumber ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {player.position ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No players have been added to this team yet.
          </p>
        )}
      </div>
    </div>
  );
}
