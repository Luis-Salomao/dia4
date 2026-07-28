import { describe, expect, it } from "vitest";
import app from "../worker/index";

describe("GET /api/health", () => {
  it("responde ok", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
