export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import { getTeamById, updateTeam } from "@/server/actions/teams";
import { getVenues } from "@/server/actions/venues";
import { PageHeader } from "@/components/ui/page-header";
import { TeamForm } from "../../_components/team-form";

interface EditTeamPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamPage({ params }: EditTeamPageProps) {
  const { id } = await params;
  const [team, venues] = await Promise.all([getTeamById(id), getVenues()]);

  if (!team) {
    notFound();
  }

  async function handleUpdateTeam(formData: FormData) {
    "use server";
    await updateTeam(id, formData);
    redirect(`/teams/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${team.name}`} />
      <TeamForm action={handleUpdateTeam} venues={venues} defaultValues={team} />
    </div>
  );
}
