export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import { getPlayerById, updatePlayer } from "@/server/actions/players";
import { getTeams } from "@/server/actions/teams";
import { PageHeader } from "@/components/ui/page-header";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { withErrorQuery } from "@/lib/url";
import { PlayerForm } from "../../_components/player-form";

interface EditPlayerPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditPlayerPage({
  params,
  searchParams,
}: EditPlayerPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const [player, teams] = await Promise.all([getPlayerById(id), getTeams()]);

  if (!player) {
    notFound();
  }

  async function handleUpdatePlayer(formData: FormData) {
    "use server";
    const result = await updatePlayer(id, formData);
    if (result?.error) {
      redirect(withErrorQuery(`/players/${id}/edit`, result.error));
    }
    redirect(`/players/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${player.fullName}`} />
      <FormErrorAlert message={error} />
      <PlayerForm
        action={handleUpdatePlayer}
        teams={teams}
        defaultValues={player}
      />
    </div>
  );
}
