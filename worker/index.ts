import { getTableColumns } from "drizzle-orm";
import { Hono } from "hono";
import { getDb } from "./db/client";
import { students } from "./db/schema";

export type Env = { DATABASE_URL: string };

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));

app.get("/api/students", async (c) => {
  const columns = Object.keys(getTableColumns(students));
  const rows = await getDb(c.env).select().from(students);
  return c.json({ columns, rows });
});

export default app;
