import { redirect } from "next/navigation";
import { createTeam } from "@/server/actions/teams";
import { getVenues } from "@/server/actions/venues";
import { PageHeader } from "@/components/ui/page-header";
import { TeamForm } from "../_components/team-form";

export default async function CreateTeamPage() {
  const venues = await getVenues();

  async function handleCreateTeam(formData: FormData) {
    "use server";
    await createTeam(formData);
    redirect("/teams");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Team" />
      <TeamForm action={handleCreateTeam} venues={venues} />
    </div>
  );
}
