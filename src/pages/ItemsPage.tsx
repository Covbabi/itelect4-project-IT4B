import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { Item } from "../types/index";
import CourseCard from "../components/CourseCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { fetchItems } from "../api/client";

function ItemsPage() {
  const { data, isPending, isError, error } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500">
        Loading lost and found items...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        {error.message}. Is json-server running on port 3001?
      </div>
    );
  }

  const filteredItems = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reported Items
        </h2>
      </div>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search items by title or location..."
        className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />

      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="mt-1 text-xs text-gray-500">
          Previous query: "{previousSearch}"
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Link key={item.id} to={`/items/${item.id}`} className="no-underline">
            <CourseCard item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ItemsPage;