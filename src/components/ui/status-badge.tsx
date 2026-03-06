const statusStyles: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  postponed: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  postponed: "Postponed",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
