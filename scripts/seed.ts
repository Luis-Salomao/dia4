import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { students } from "../worker/db/schema";

const db = drizzle(neon(process.env.DATABASE_URL!));

await db.delete(students);
await db.insert(students).values([
  { name: "Luis", campus: "Garopaba", course: "TSI" },
  { name: "Maria", campus: "Florianópolis", course: "ADS" },
  { name: "João", campus: "Garopaba", course: "TSI" },
]);

console.log("seed: 3 registros");
