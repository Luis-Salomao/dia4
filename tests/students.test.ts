import { neon } from "@neondatabase/serverless";
import { beforeAll, describe, expect, it } from "vitest";
import app from "../worker/index";

const env = { DATABASE_URL: process.env.DATABASE_URL! };

beforeAll(() => {
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL ausente");
});

async function get() {
  const res = await app.request("/api/students", {}, env);
  return { res, body: (await res.json()) as { columns: string[]; rows: unknown[] } };
}

describe("GET /api/students", () => {
  it("devolve as linhas do seed", async () => {
    const { res, body } = await get();
    expect(res.status).toBe(200);
    expect(body.rows).toHaveLength(3);
    expect(body.rows.map((r) => (r as { name: string }).name)).toContain("Luis");
  });

  it("cria um estudante via POST e ele aparece na listagem", async () => {
    const res = await app.request(
      "/api/students",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Teste", campus: "Garopaba", course: "TSI" }),
      },
      env,
    );
    expect(res.status).toBe(201);
    const criado = (await res.json()) as { id: number; name: string };
    expect(criado.name).toBe("Teste");

    // O finally garante que a linha nao sobra e quebra a contagem do teste do seed.
    try {
      const { body } = await get();
      expect(body.rows.some((r) => (r as { id: number }).id === criado.id)).toBe(true);
    } finally {
      await neon(env.DATABASE_URL)`DELETE FROM students WHERE id = ${criado.id}`;
    }
  });

  it("rejeita POST sem name com 400", async () => {
    const res = await app.request(
      "/api/students",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ campus: "Garopaba" }),
      },
      env,
    );
    expect(res.status).toBe(400);
  });

  it("as colunas declaradas batem com as colunas reais do postgres", async () => {
    const { body } = await get();
    const sql = neon(env.DATABASE_URL);
    const real = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'students' AND table_schema = 'public'
    `;
    const noBanco = (real as { column_name: string }[]).map((r) => r.column_name).sort();
    const naApi = body.columns
      .map((c) => c.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`))
      .sort();
    expect(naApi).toEqual(noBanco);
  });
});
