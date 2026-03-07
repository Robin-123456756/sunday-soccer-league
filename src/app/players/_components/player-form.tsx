"use client";

import Link from "next/link";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

interface Team {
  id: string;
  name: string;
}

interface PlayerDefaultValues {
  fullName?: string;
  teamId?: string | null;
  jerseyNumber?: number | null;
  position?: string | null;
  registrationNumber?: string | null;
}

interface PlayerFormProps {
  action: (formData: FormData) => Promise<void>;
  teams: Team[];
  defaultValues?: PlayerDefaultValues;
}

export function PlayerForm({ action, teams, defaultValues }: PlayerFormProps) {
  return (
    <form
      action={action}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-5">
        <FormField label="Full Name" name="fullName" required>
          <input
            type="text"
            name="fullName"
            required
            defaultValue={defaultValues?.fullName ?? ""}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. John Smith"
          />
        </FormField>

        <FormField label="Team" name="teamId" required>
          <select
            name="teamId"
            required
            defaultValue={defaultValues?.teamId ?? ""}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a team...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Jersey Number" name="jerseyNumber">
            <input
              type="number"
              name="jerseyNumber"
              min="1"
              max="99"
              defaultValue={defaultValues?.jerseyNumber ?? ""}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. 10"
            />
          </FormField>

          <FormField label="Position" name="position">
            <select
              name="position"
              defaultValue={defaultValues?.position ?? ""}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select position...</option>
              <option value="GK">GK</option>
              <option value="DEF">DEF</option>
              <option value="MID">MID</option>
              <option value="FWD">FWD</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Registration Number" name="registrationNumber">
            <input
              type="text"
              name="registrationNumber"
              defaultValue={defaultValues?.registrationNumber ?? ""}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. REG-001"
            />
          </FormField>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Link
          href="/players"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
