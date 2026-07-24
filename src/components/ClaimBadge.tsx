import type { ReactNode } from "react";
import type { Claim } from "../types/index";

interface ClaimBadgeProps {
  claim: Claim;
  children?: ReactNode;
}

const ClaimBadge = ({ claim, children }: ClaimBadgeProps) => {
  return (
    <article className="card claim-badge">
      <div className="card-header">
        <span className="badge">CLAIM</span>
      </div>
      <p>Item ID: {claim.itemId}</p>
      <p>Claimed by: {claim.claimedBy}</p>
      <p>Submitted at: {claim.submittedAt.toLocaleString()}</p>
      <p>Status: {claim.verifiedBy ? "Verified" : "Pending"}</p>
      {children}
    </article>
  );
};

export default ClaimBadge;
