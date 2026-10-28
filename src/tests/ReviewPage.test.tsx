import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReviewPage from "../pages/ReviewPage";

// ── Form test ─────────────────────────────────────────────────────────────────
// Requirement: press the submit button of one of YOUR validated forms with bad
// input, find your schema's exact error message, and check with
// vi.spyOn(globalThis, "fetch") that no request was sent.
//
// reviewFormSchema requires the prompt to be at least 20 characters.
// Submitting with a short string (< 20 chars) must:
//   1. Show the exact message from reviewSchema.ts:
//      "Describe your project in at least 20 characters."
//   2. Never call fetch (the API call is never made).
// ─────────────────────────────────────────────────────────────────────────────

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return Wrapper;
}

describe("ReviewPage form validation", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on fetch BEFORE each test so we can assert it was never called.
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  it("shows the schema error message when the prompt is too short and never calls fetch", async () => {
    const user = userEvent.setup();
    render(<ReviewPage />, { wrapper: makeWrapper() });

    // Type a description that is shorter than 20 characters.
    await user.type(screen.getByRole("textbox"), "too short");

    // Press the submit button.
    await user.click(screen.getByRole("button", { name: /review my project/i }));

    // The exact validation message from reviewFormSchema.
    expect(
      await screen.findByText("Describe your project in at least 20 characters.")
    ).toBeInTheDocument();

    // fetch must NOT have been called — the request was blocked by the schema.
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("shows the schema error when the textarea is left empty and never calls fetch", async () => {
    const user = userEvent.setup();
    render(<ReviewPage />, { wrapper: makeWrapper() });

    // Click submit without typing anything.
    await user.click(screen.getByRole("button", { name: /review my project/i }));

    expect(
      await screen.findByText("Describe your project in at least 20 characters.")
    ).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
