import { defineConfig } from "vitest/config";

// Mesmo criterio do drizzle.config.ts: .env local quando existe, senao process.env.
try {
  process.loadEnvFile(".env");
} catch {
  // sem .env: segue com process.env
}

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
