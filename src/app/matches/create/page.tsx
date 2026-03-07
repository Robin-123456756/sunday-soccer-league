export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createMatch } from "@/server/actions/matches";
import { getTeams } from "@/server/actions/teams";
import { getReferees } from "@/server/actions/referees";
import { getVenues } from "@/server/actions/venues";
import { getSeasons } from "@/server/actions/seasons";
import { PageHeader } from "@/components/ui/page-header";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { withErrorQuery } from "@/lib/url";
import { MatchForm } from "../_components/match-form";

interface CreateMatchPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function CreateMatchPage({
  searchParams,
}: CreateMatchPageProps) {
  const { error } = await searchParams;
  const [teams, referees, venues, seasons] = await Promise.all([
    getTeams(),
    getReferees(),
    getVenues(),
    getSeasons(),
  ]);

  async function handleCreateMatch(formData: FormData) {
    "use server";
    const result = await createMatch(formData);
    if (result?.error) {
      redirect(withErrorQuery("/matches/create", result.error));
    }
    redirect("/matches");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Fixture" />
      <FormErrorAlert message={error} />
      <MatchForm
        action={handleCreateMatch}
        teams={teams}
        venues={venues}
        referees={referees}
        seasons={seasons}
      />
    </div>
  );
}
