import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SubmissionBadge from "../components/SubmissionBadge";

// ── Component test ────────────────────────────────────────────────────────────
// Requirement: render one of YOUR components with typed sample data and check,
// by its exact text, one thing that changes with a prop.
//
// SubmissionBadge receives a `status` prop and renders its value as visible
// text (e.g. "lost", "found", "pending", "verified").  The text changes
// entirely with the prop, which makes it a clean, unambiguous assertion.
// ─────────────────────────────────────────────────────────────────────────────

describe("SubmissionBadge", () => {
  it('renders the exact text "lost" when status="lost"', () => {
    render(<SubmissionBadge status="lost" />);
    expect(screen.getByText("lost")).toBeInTheDocument();
  });

  it('renders the exact text "found" when status="found"', () => {
    render(<SubmissionBadge status="found" />);
    expect(screen.getByText("found")).toBeInTheDocument();
  });

  it('renders the exact text "pending" when status="pending"', () => {
    render(<SubmissionBadge status="pending" />);
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it('renders the exact text "verified" when status="verified"', () => {
    render(<SubmissionBadge status="verified" />);
    expect(screen.getByText("verified")).toBeInTheDocument();
  });
});
