export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createPlayer } from "@/server/actions/players";
import { getTeams } from "@/server/actions/teams";
import { PageHeader } from "@/components/ui/page-header";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { withErrorQuery } from "@/lib/url";
import { PlayerForm } from "../_components/player-form";

interface CreatePlayerPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function CreatePlayerPage({
  searchParams,
}: CreatePlayerPageProps) {
  const { error } = await searchParams;
  const teams = await getTeams();

  async function handleCreatePlayer(formData: FormData) {
    "use server";
    const result = await createPlayer(formData);
    if (result?.error) {
      redirect(withErrorQuery("/players/create", result.error));
    }
    redirect("/players");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add Player" />
      <FormErrorAlert message={error} />
      <PlayerForm action={handleCreatePlayer} teams={teams} />
    </div>
  );
}
