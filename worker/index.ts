import { getTableColumns } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { getDb } from "./db/client";
import { students } from "./db/schema";

const novoEstudante = z.object({
  name: z.string().min(1),
  campus: z.string().min(1),
  course: z.string().optional(),
});

export type Env = { DATABASE_URL: string };

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));

app.get("/api/students", async (c) => {
  const columns = Object.keys(getTableColumns(students));
  const rows = await getDb(c.env).select().from(students);
  return c.json({ columns, rows });
});

app.post("/api/students", async (c) => {
  const corpo = await c.req.json().catch(() => null);
  const parsed = novoEstudante.safeParse(corpo);
  if (!parsed.success) {
    return c.json({ erro: "payload invalido", detalhes: parsed.error.issues }, 400);
  }
  const [criado] = await getDb(c.env).insert(students).values(parsed.data).returning();
  return c.json(criado, 201);
});

export default app;
