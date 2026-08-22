import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import type { Item } from "../types/index";
import CourseCard from "../components/CourseCard";
import { fetchItemById } from "../api/client";

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery<Item>({
    queryKey: ["items", id],
    queryFn: () => fetchItemById(id!),
    enabled: id !== undefined,
  });

  if (isPending) {
    return (
      <div className="animate-pulse p-6 text-gray-500">
        Loading item details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Item Details
      </h2>
      <CourseCard item={data} />
      <button
        onClick={() => navigate("/items")}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        ← Back to All Items
      </button>
    </div>
  );
}

export default ItemDetailPage;