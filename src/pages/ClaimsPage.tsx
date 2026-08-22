import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiClaim } from "../types/index";
import { fetchClaims, createClaim } from "../api/client";

function ClaimsPage() {
  const [itemTitle, setItemTitle] = useState<string>("");
  const queryClient = useQueryClient();

  // 1. READ claims using useQuery
  const { data, isPending, isError } = useQuery<ApiClaim[]>({
    queryKey: ["claims"],
    queryFn: fetchClaims,
  });

  // 2. WRITE claim using useMutation
  const addClaimMutation = useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      setItemTitle("");
    },
  });

  const handleAddClaim = (): void => {
    if (!itemTitle.trim()) return;

    addClaimMutation.mutate({
      itemId: 1,
      claimedBy: 1,
      submittedAt: new Date().toISOString(),
      status: "pending",
      itemTitle: itemTitle,
    });
  };

  if (isPending) {
    return <div className="animate-pulse p-6 text-gray-500">Loading claims...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        Could not load claims.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Claims
      </h2>

      {/* Claim Submission Form */}
      <div className="mb-6 flex gap-2 max-w-md">
        <input
          value={itemTitle}
          onChange={(e) => setItemTitle(e.target.value)}
          placeholder="Enter item title to claim..."
          className="w-full rounded border border-gray-300 p-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleAddClaim}
          disabled={!itemTitle.trim() || addClaimMutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {addClaimMutation.isPending ? "Submitting..." : "File Claim"}
        </button>
      </div>

      {addClaimMutation.isError && (
        <p className="mb-4 text-sm text-red-600">
          {addClaimMutation.error.message}
        </p>
      )}

      {/* Claims List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((claim) => (
          <div
            key={claim.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {claim.itemTitle || `Claim #${claim.id}`}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
            </p>
            <span className="mt-2 inline-block rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
              Status: {claim.status || "pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClaimsPage;