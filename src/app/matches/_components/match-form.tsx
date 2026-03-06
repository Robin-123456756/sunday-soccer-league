"use client";

import Link from "next/link";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

interface Team {
  id: string;
  name: string;
}

interface Venue {
  id: string;
  name: string;
}

interface Referee {
  id: string;
  fullName: string;
}

interface Season {
  id: string;
  name: string;
}

interface MatchDefaultValues {
  matchDate?: string;
  kickoffTime?: string | null;
  venueId?: string | null;
  homeTeamId?: string;
  awayTeamId?: string;
  homeJerseyColor?: string | null;
  awayJerseyColor?: string | null;
  refereeId?: string | null;
  seasonId?: string | null;
}

interface MatchFormProps {
  action: (formData: FormData) => Promise<void>;
  teams: Team[];
  venues: Venue[];
  referees: Referee[];
  seasons: Season[];
  defaultValues?: MatchDefaultValues;
}

export function MatchForm({
  action,
  teams,
  venues,
  referees,
  seasons,
  defaultValues,
}: MatchFormProps) {
  return (
    <form
      action={action}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Match Date" name="matchDate" required>
            <input
              type="date"
              name="matchDate"
              required
              defaultValue={defaultValues?.matchDate ?? ""}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </FormField>

          <FormField label="Kickoff Time" name="kickoffTime">
            <input
              type="time"
              name="kickoffTime"
              defaultValue={defaultValues?.kickoffTime ?? ""}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </FormField>
        </div>

        <FormField label="Venue" name="venueId">
          <select
            name="venueId"
            defaultValue={defaultValues?.venueId ?? ""}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Select a venue...</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Home Team" name="homeTeamId" required>
            <select
              name="homeTeamId"
              required
              defaultValue={defaultValues?.homeTeamId ?? ""}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">Select home team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Away Team" name="awayTeamId" required>
            <select
              name="awayTeamId"
              required
              defaultValue={defaultValues?.awayTeamId ?? ""}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">Select away team...</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Home Jersey Color" name="homeJerseyColor">
            <input
              type="color"
              name="homeJerseyColor"
              defaultValue={defaultValues?.homeJerseyColor ?? "#ffffff"}
              className="h-10 w-full cursor-pointer rounded-md border border-gray-300"
            />
          </FormField>

          <FormField label="Away Jersey Color" name="awayJerseyColor">
            <input
              type="color"
              name="awayJerseyColor"
              defaultValue={defaultValues?.awayJerseyColor ?? "#000000"}
              className="h-10 w-full cursor-pointer rounded-md border border-gray-300"
            />
          </FormField>
        </div>

        <FormField label="Referee" name="refereeId">
          <select
            name="refereeId"
            defaultValue={defaultValues?.refereeId ?? ""}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Select a referee...</option>
            {referees.map((referee) => (
              <option key={referee.id} value={referee.id}>
                {referee.fullName}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Season" name="seasonId">
          <select
            name="seasonId"
            defaultValue={defaultValues?.seasonId ?? ""}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Select a season...</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Link
          href="/matches"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
