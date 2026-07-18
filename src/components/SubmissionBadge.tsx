import type { ReactNode } from "react";
import type { Submission } from "../types/index";

interface SubmissionBadgeProps {
  submission: Submission;
  children?: ReactNode;
}

const SubmissionBadge = ({
  submission,
  children,
}: SubmissionBadgeProps) => {
  return (
    <article className="card submission-badge">
      <div className="card-header">
        <span className="badge">CLAIM</span>
      </div>
      <p>Repo: {submission.repoUrl}</p>
      <p>Score: {submission.score ?? "Not graded yet"}</p>
      {children}
    </article>
  );
};

export default SubmissionBadge;