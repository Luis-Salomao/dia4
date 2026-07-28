import { useCallback, useEffect, useState } from "react";

type Payload = { columns: string[]; rows: Record<string, unknown>[] };

const VAZIO = { name: "", campus: "", course: "" };

export default function App() {
  const [data, setData] = useState<Payload | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(() => {
    fetch("/api/students")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setData)
      .catch((e: Error) => setErro(e.message));
  }, []);

  useEffect(carregar, [carregar]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          campus: form.campus,
          course: form.course || undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setForm(VAZIO);
      carregar();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  if (erro && !data) return <p>Erro ao carregar: {erro}</p>;
  if (!data) return <p>Carregando…</p>;

  const podeEnviar = form.name.trim() !== "" && form.campus.trim() !== "" && !enviando;

  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem" }}>
      <h1>dia4</h1>

      <table cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {data.columns.map((c) => (
              <th key={c} style={{ borderBottom: "2px solid #333", textAlign: "left" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i}>
              {data.columns.map((c) => (
                <td key={c} style={{ borderBottom: "1px solid #ccc" }}>
                  {String(row[c] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={enviar} style={{ marginTop: "1.5rem", display: "flex", gap: ".5rem" }}>
        <input
          placeholder="nome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="campus"
          value={form.campus}
          onChange={(e) => setForm({ ...form, campus: e.target.value })}
        />
        <input
          placeholder="curso (opcional)"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
        <button type="submit" disabled={!podeEnviar}>
          {enviando ? "salvando…" : "adicionar"}
        </button>
      </form>

      {erro && <p style={{ color: "#b00" }}>Erro: {erro}</p>}
    </main>
  );
}
