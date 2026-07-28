import { defineConfig } from "drizzle-kit";

// Carrega o .env quando ele existe (uso local). No CI nao existe .env e as
// variaveis ja vem do bloco `env:` do workflow, entao a ausencia nao e erro.
try {
  process.loadEnvFile(".env");
} catch {
  // sem .env: segue com process.env
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./worker/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
