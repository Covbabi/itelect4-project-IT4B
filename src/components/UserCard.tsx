import type { ChangeEvent, MouseEvent } from "react";
import type { User } from "../types/index";

interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
  isSelected?: boolean;
  variant?: "default" | "compact";
}

function UserCard({ user, onSelect, isSelected = false, variant = "default" }: UserCardProps) {
  const isCompact = variant === "compact";

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLDivElement>): void => {
    if (onSelect) onSelect(user);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("Search:", event.target.value);
  };

  return (
    <article
      onClick={handleClick}
      className={`rounded-lg border transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-400 shadow-md ring-2 ring-blue-500/20"
          : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:shadow-md"
      } ${isCompact ? "p-3" : "p-5"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold uppercase text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
          User
        </span>
        {onSelect && !isCompact && (
          <button
            type="button"
            onClick={handleClick}
            className="rounded px-2.5 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700"
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        )}
      </div>

      <h3 className={`font-bold text-gray-900 dark:text-white ${isCompact ? "text-base" : "text-lg"}`}>
        {user.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
      
      {!isCompact && (
        <>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 capitalize">
            Role: <span className="font-medium text-gray-700 dark:text-gray-300">{user.role}</span>
          </p>
          <input
            className="mt-3 w-full rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            onChange={handleChange}
            placeholder="Search user data..."
          />
        </>
      )}
    </article>
  );
}

export default UserCard;