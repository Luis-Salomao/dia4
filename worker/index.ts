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

// DIAGNOSTICO TEMPORARIO - remover depois de identificar a origem do 500.
// Nao expoe credencial: so o host do endpoint e a mensagem do erro.
app.get("/api/diag", async (c) => {
  const host = (c.env.DATABASE_URL ?? "").split("@")[1]?.split("/")[0] ?? "(sem DATABASE_URL)";
  try {
    await getDb(c.env).select().from(students);
    return c.json({ host, ok: true });
  } catch (e) {
    const err = e as Error;
    return c.json({ host, ok: false, name: err.name, message: err.message });
  }
});

export default app;
