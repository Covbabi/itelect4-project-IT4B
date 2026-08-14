import SubmissionBadge from "../components/SubmissionBadge";
import { sampleClaims, sampleItems } from "../data/mockData";

function ClaimsPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Item Claims
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sampleClaims.map((claim) => {
          const item = sampleItems.find((i) => i.id === claim.itemId);
          return (
            <div
              key={claim.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {item ? item.title : `Item #${claim.itemId}`}
                </h3>
                <SubmissionBadge status="pending" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Claim ID: {claim.id}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Submitted at: {claim.submittedAt.toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClaimsPage;