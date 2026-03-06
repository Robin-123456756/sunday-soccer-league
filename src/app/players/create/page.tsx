export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createPlayer } from "@/server/actions/players";
import { getTeams } from "@/server/actions/teams";
import { PageHeader } from "@/components/ui/page-header";
import { PlayerForm } from "../_components/player-form";

export default async function CreatePlayerPage() {
  const teams = await getTeams();

  async function handleCreatePlayer(formData: FormData) {
    "use server";
    await createPlayer(formData);
    redirect("/players");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Add Player" />
      <PlayerForm action={handleCreatePlayer} teams={teams} />
    </div>
  );
}
