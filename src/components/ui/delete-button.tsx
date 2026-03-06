"use client";

import { useFormStatus } from "react-dom";

function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm("Are you sure? This action cannot be undone.")) {
          e.preventDefault();
        }
      }}
      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <DeleteSubmitButton />
    </form>
  );
}
