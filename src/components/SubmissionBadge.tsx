interface SubmissionBadgeProps {
  status: "lost" | "found" | "pending" | "verified";
  variant?: "default" | "compact";
}

function SubmissionBadge({ status, variant = "default" }: SubmissionBadgeProps) {
  const isCompact = variant === "compact";

  const statusStyles: Record<string, string> = {
    lost: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-800",
    found: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    verified: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold capitalize transition-all ${
        statusStyles[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      } ${isCompact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"}`}
    >
      {status}
    </span>
  );
}

export default SubmissionBadge;