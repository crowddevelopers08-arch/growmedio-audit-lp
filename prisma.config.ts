import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Prisma 7 doesn't read env files on its own — load .env.local the same way
// Next.js does, so the CLI and the app share one set of variables.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations should use Neon's direct (non-pooled) connection; fall back to
    // the pooled URL when only one is set.
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
  },
});
