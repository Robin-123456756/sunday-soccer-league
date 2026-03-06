"use client";

import Link from "next/link";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

interface RefereeDefaultValues {
  fullName?: string;
  phone?: string | null;
  email?: string | null;
  level?: string | null;
}

interface RefereeFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: RefereeDefaultValues;
}

export function RefereeForm({ action, defaultValues }: RefereeFormProps) {
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
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="e.g. Michael Owen"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Phone" name="phone">
            <input
              type="text"
              name="phone"
              defaultValue={defaultValues?.phone ?? ""}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="e.g. 07700 900000"
            />
          </FormField>

          <FormField label="Email" name="email">
            <input
              type="email"
              name="email"
              defaultValue={defaultValues?.email ?? ""}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="e.g. referee@example.com"
            />
          </FormField>
        </div>

        <FormField label="Level" name="level">
          <select
            name="level"
            defaultValue={defaultValues?.level ?? ""}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="">Select level...</option>
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
            <option value="Senior">Senior</option>
          </select>
        </FormField>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Link
          href="/referees"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <SubmitButton />
      </div>
    </form>
  );
}
