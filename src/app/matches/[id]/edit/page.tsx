export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { getMatchById, updateMatch } from "@/server/actions/matches";
import { getTeams } from "@/server/actions/teams";
import { getReferees } from "@/server/actions/referees";
import { getVenues } from "@/server/actions/venues";
import { getSeasons } from "@/server/actions/seasons";
import { PageHeader } from "@/components/ui/page-header";
import { FormErrorAlert } from "@/components/ui/form-error-alert";
import { withErrorQuery } from "@/lib/url";
import { MatchForm } from "../../_components/match-form";

interface EditMatchPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}

function formatDateForInput(value: Date | string) {
  return new Date(value).toISOString().split("T")[0];
}

export default async function EditMatchPage({
  params,
  searchParams,
}: EditMatchPageProps) {
  const { id } = await params;
  const { error } = await searchParams;

  const [match, teams, referees, venues, seasons] = await Promise.all([
    getMatchById(id),
    getTeams(),
    getReferees(),
    getVenues(),
    getSeasons(),
  ]);

  if (!match) {
    notFound();
  }

  async function handleUpdateMatch(formData: FormData) {
    "use server";
    const result = await updateMatch(id, formData);
    if (result?.error) {
      redirect(withErrorQuery(`/matches/${id}/edit`, result.error));
    }
    redirect(`/matches/${id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Fixture" />
      <FormErrorAlert message={error} />
      <MatchForm
        action={handleUpdateMatch}
        teams={teams}
        venues={venues}
        referees={referees}
        seasons={seasons}
        defaultValues={{
          matchDate: formatDateForInput(match.matchDate),
          kickoffTime: match.kickoffTime,
          venueId: match.venueId,
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          homeJerseyColor: match.homeJerseyColor,
          awayJerseyColor: match.awayJerseyColor,
          refereeId: match.refereeId,
          seasonId: match.seasonId,
        }}
      />
    </div>
  );
}
