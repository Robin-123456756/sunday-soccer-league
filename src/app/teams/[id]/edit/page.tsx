export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import { getTeamById, updateTeam } from "@/server/actions/teams";
import { getVenues } from "@/server/actions/venues";
import { PageHeader } from "@/components/ui/page-header";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { withErrorQuery } from "@/lib/url";
import { TeamForm } from "../../_components/team-form";

interface EditTeamPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function EditTeamPage({
  params,
  searchParams,
}: EditTeamPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const [team, venues] = await Promise.all([getTeamById(id), getVenues()]);

  if (!team) {
    notFound();
  }

  async function handleUpdateTeam(formData: FormData) {
    "use server";
    const result = await updateTeam(id, formData);
    if (result?.error) {
      redirect(withErrorQuery(`/teams/${id}/edit`, result.error));
    }
    redirect(`/teams/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${team.name}`} />
      <FormErrorAlert message={error} />
      <TeamForm action={handleUpdateTeam} venues={venues} defaultValues={team} />
    </div>
  );
}
