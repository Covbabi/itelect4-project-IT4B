import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AiReview } from "../types/index";
import { askAi } from "../api/client";
import { reviewFormSchema } from "../schemas/reviewSchema";
import type { ReviewFormValues } from "../schemas/reviewSchema";

// Record: one entry for every value readiness can have.
const READINESS_STYLE: Record<AiReview["readiness"], string> = {
  "ready":   "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "almost":  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  "not-yet": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

function ReviewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    // Default validates on submit, preventing missed clicks when errors appear
    defaultValues: { prompt: "" },
  });

  // A mutation, not a query: it runs when the button is pressed, never
  // on page load, and asking twice is two requests.
  const review = useMutation({
    mutationFn: askAi,
  });

  const onSubmit = (values: ReviewFormValues): void => {
    review.mutate(values.prompt);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
        AI Review
      </h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Describe your project and get feedback before you submit it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="prompt" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Project description
          </label>
          <textarea
            id="prompt"
            rows={6}
            {...register("prompt")}
            aria-invalid={errors.prompt ? true : undefined}
            placeholder="What it does, how it is built, where it runs..."
            className="rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
          />
          {errors.prompt && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.prompt.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={review.isPending}
          className="justify-self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {review.isPending ? "Reviewing..." : "Review my project"}
        </button>
      </form>

      {/* The API's own sentence: the rate limit, the quota, or a refusal from the schema -- never Google's raw error text. */}
      {review.isError && (
        <p className="mt-4 text-sm text-red-700 dark:text-red-400">{review.error.message}</p>
      )}

      {review.data && (
        <div className="mt-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <span
            className={`justify-self-start rounded px-2.5 py-0.5 text-sm font-semibold capitalize ${READINESS_STYLE[review.data.readiness]}`}
          >
            {review.data.readiness}
          </span>
          <p className="text-gray-900 dark:text-white">
            {review.data.summary}
          </p>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Strengths
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-1">
              {review.data.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Before you submit
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-1">
              {review.data.improvements.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewPage;
