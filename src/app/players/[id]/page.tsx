export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getPlayerById } from "@/server/actions/players";
import { archivePlayer as deletePlayer } from "@/server/actions/archive";
import { PageHeader } from "@/components/ui/page-header";
import { DeleteButton } from "@/components/ui/delete-button";

interface PlayerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerDetailPage({
  params,
}: PlayerDetailPageProps) {
  const { id } = await params;
  const player = await getPlayerById(id);

  if (!player) {
    notFound();
  }

  async function handleDeletePlayer() {
    "use server";
    await deletePlayer(id);
    redirect("/players");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={player.fullName}
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/players/${player.id}/edit`}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Edit
            </Link>
            <DeleteButton action={handleDeletePlayer} />
          </div>
        }
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Player Information
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{player.fullName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Team</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {player.team ? (
                <Link
                  href={`/teams/${player.team.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {player.team.name}
                </Link>
              ) : (
                <span className="text-gray-400">Not assigned</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Jersey Number</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {player.jerseyNumber ?? <span className="text-gray-400">Not set</span>}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Position</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {player.position ?? <span className="text-gray-400">Not set</span>}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Registration Number
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {player.registrationNumber ?? (
                <span className="text-gray-400">Not set</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
