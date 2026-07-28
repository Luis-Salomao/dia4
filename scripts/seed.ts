import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { students } from "../worker/db/schema";

const db = drizzle(neon(process.env.DATABASE_URL!));

await db.delete(students);
await db.insert(students).values([
  { name: "Luis", campus: "Garopaba", course: "TSI", phone: "48 99999-0001" },
  { name: "Maria", campus: "Florianópolis", course: "ADS", phone: "48 99999-0002" },
  { name: "João", campus: "Garopaba", course: "TSI", phone: "48 99999-0003" },
]);

console.log("seed: 3 registros");
