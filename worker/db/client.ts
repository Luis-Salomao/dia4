import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { Env } from "../index";
import * as schema from "./schema";

export function getDb(env: Env) {
  return drizzle(neon(env.DATABASE_URL), { schema });
}
