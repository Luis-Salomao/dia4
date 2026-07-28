import { Hono } from "hono";

export type Env = { DATABASE_URL: string };

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));

export default app;
