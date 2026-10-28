import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useToggle from "../hooks/useToggle";

// ── Hook test ─────────────────────────────────────────────────────────────────
// Requirement: renderHook on one of YOUR custom hooks, check its starting
// value, call its function inside act(), check the new value.
//
// useToggle(initialValue) returns [value, toggle].
//   • Initial value matches the argument passed in.
//   • Calling toggle() inside act() flips the boolean.
//   • Calling it again flips it back.
// ─────────────────────────────────────────────────────────────────────────────

describe("useToggle", () => {
  it("starts with the initial value false by default", () => {
    const { result } = renderHook(() => useToggle());
    const [value] = result.current;
    expect(value).toBe(false);
  });

  it("starts with the initial value true when passed true", () => {
    const { result } = renderHook(() => useToggle(true));
    const [value] = result.current;
    expect(value).toBe(true);
  });

  it("flips to true after calling toggle once", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      const [, toggle] = result.current;
      toggle();
    });

    const [value] = result.current;
    expect(value).toBe(true);
  });

  it("flips back to false after calling toggle twice", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      const [, toggle] = result.current;
      toggle();
    });

    act(() => {
      const [, toggle] = result.current;
      toggle();
    });

    const [value] = result.current;
    expect(value).toBe(false);
  });
});
