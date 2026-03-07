export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createTeam } from "@/server/actions/teams";
import { PageHeader } from "@/components/ui/page-header";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { withErrorQuery } from "@/lib/url";
import { TeamForm } from "../_components/team-form";

interface CreateTeamPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function CreateTeamPage({
  searchParams,
}: CreateTeamPageProps) {
  const { error } = await searchParams;

  async function handleCreateTeam(formData: FormData) {
    "use server";
    const result = await createTeam(formData);
    if (result?.error) {
      redirect(withErrorQuery("/teams/create", result.error));
    }
    redirect("/teams");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Team" />
      <FormErrorAlert message={error} />
      <TeamForm action={handleCreateTeam} />
    </div>
  );
}
