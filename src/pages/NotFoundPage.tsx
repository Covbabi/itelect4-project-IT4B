import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="py-12 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        404 — Page Not Found
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block text-sm font-semibold text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;