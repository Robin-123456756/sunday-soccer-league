"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}
