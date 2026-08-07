import type { Item } from "../types/index";
import SubmissionBadge from "./SubmissionBadge";

interface ItemCardProps {
  item: Item;
  reporterName?: string;
  onClaim?: (itemId: number) => void;
  variant?: "default" | "compact";
}

function ItemCard({ item, reporterName, onClaim, variant = "default" }: ItemCardProps) {
  const isCompact = variant === "compact";

  return (
    <article
      className={`flex flex-col justify-between rounded-lg border border-gray-200 bg-white shadow-sm transition-all dark:border-gray-700 dark:bg-gray-800 ${
        isCompact ? "p-3" : "p-5"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            ITEM #{item.id}
          </span>
          <SubmissionBadge status={item.status} variant={isCompact ? "compact" : "default"} />
        </div>

        <h3 className={`font-bold text-gray-900 dark:text-white ${isCompact ? "text-base" : "text-lg"}`}>
          {item.title}
        </h3>

        {!isCompact && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>}

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          📍 {item.location}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Reported by: <span className="font-medium text-gray-700 dark:text-gray-300">{reporterName ?? item.reportedBy}</span>
        </p>
      </div>

      {onClaim && (
        <button
          type="button"
          onClick={() => onClaim(item.id)}
          className="mt-4 w-full rounded-md bg-blue-600 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Claim Item
        </button>
      )}
    </article>
  );
}

export default ItemCard;