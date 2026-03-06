export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { createMatch } from "@/server/actions/matches";
import { getTeams } from "@/server/actions/teams";
import { getReferees } from "@/server/actions/referees";
import { getVenues } from "@/server/actions/venues";
import { getSeasons } from "@/server/actions/seasons";
import { PageHeader } from "@/components/ui/page-header";
import { MatchForm } from "../_components/match-form";

export default async function CreateMatchPage() {
  const [teams, referees, venues, seasons] = await Promise.all([
    getTeams(),
    getReferees(),
    getVenues(),
    getSeasons(),
  ]);

  async function handleCreateMatch(formData: FormData) {
    "use server";
    await createMatch(formData);
    redirect("/matches");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Fixture" />
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
