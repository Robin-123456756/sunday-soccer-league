"use client";

import Link from "next/link";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

interface TeamDefaultValues {
  name?: string;
  shortName?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  homeVenue?: string | null;
}

interface TeamFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: TeamDefaultValues;
}

export function TeamForm({ action, defaultValues }: TeamFormProps) {
  return (
    <form
      action={action}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-5">
        <FormField label="Team Name" name="name" required>
          <input
            type="text"
            name="name"
            required
            defaultValue={defaultValues?.name ?? ""}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Sunday Strikers"
          />
        </FormField>

        <FormField label="Short Name" name="shortName">
          <input
            type="text"
            name="shortName"
            defaultValue={defaultValues?.shortName ?? ""}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. SST"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Primary Color" name="primaryColor">
            <input
              type="color"
              name="primaryColor"
              defaultValue={defaultValues?.primaryColor ?? "#3b82f6"}
              className="h-10 w-full cursor-pointer rounded-md border border-gray-300"
            />
          </FormField>

          <FormField label="Secondary Color" name="secondaryColor">
            <input
              type="color"
              name="secondaryColor"
              defaultValue={defaultValues?.secondaryColor ?? "#ffffff"}
              className="h-10 w-full cursor-pointer rounded-md border border-gray-300"
            />
          </FormField>
        </div>

        <FormField label="Home Venue" name="homeVenue">
          <input
            type="text"
            name="homeVenue"
            defaultValue={defaultValues?.homeVenue ?? ""}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Main Pitch"
          />
        </FormField>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Link
          href="/teams"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
