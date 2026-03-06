import { notFound, redirect } from "next/navigation";
import { getPlayerById, updatePlayer } from "@/server/actions/players";
import { getTeams } from "@/server/actions/teams";
import { PageHeader } from "@/components/ui/page-header";
import { PlayerForm } from "../../_components/player-form";

interface EditPlayerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlayerPage({ params }: EditPlayerPageProps) {
  const { id } = await params;
  const [player, teams] = await Promise.all([getPlayerById(id), getTeams()]);

  if (!player) {
    notFound();
  }

  async function handleUpdatePlayer(formData: FormData) {
    "use server";
    await updatePlayer(id, formData);
    redirect(`/players/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${player.fullName}`} />
      <PlayerForm
        action={handleUpdatePlayer}
        teams={teams}
        defaultValues={player}
      />
    </div>
  );
}
