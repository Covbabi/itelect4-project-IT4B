import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  test: {
    // Use jsdom so React components can render without a real browser.
    environment: "jsdom",

    // Make describe/it/expect globals — required by @testing-library/jest-dom
    // v6+, which calls expect.extend() at module level in setup files.
    globals: true,

    // Import jest-dom matchers (toBeInTheDocument, etc.) before every test.
    setupFiles: ["./src/tests/setup.ts"],

    // Expose VITE_API_URL so the API client module resolves without errors.
    // Tests never reach a real server — fetch is spied on or the test simply
    // never submits a valid form.
    env: {
      VITE_API_URL: "http://localhost:4000",
    },
  },
});
