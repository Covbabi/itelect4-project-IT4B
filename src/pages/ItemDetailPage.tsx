import { useParams, useNavigate } from "react-router";
import CourseCard from "../components/CourseCard";
import { sampleItems } from "../data/mockData";

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const itemId = id ? parseInt(id, 10) : NaN;
  const item = sampleItems.find((i) => i.id === itemId);

  if (!item) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        No item found with ID "{id}"
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Item Details
      </h2>
      <CourseCard item={item} />
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