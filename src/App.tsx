import { useEffect, useState } from "react";

type Payload = { columns: string[]; rows: Record<string, unknown>[] };

export default function App() {
  const [data, setData] = useState<Payload | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setData)
      .catch((e: Error) => setErro(e.message));
  }, []);

  if (erro) return <p>Erro ao carregar: {erro}</p>;
  if (!data) return <p>Carregando…</p>;

  return (
    <main style={{ fontFamily: "system-ui", padding: "2rem", background: "#1e1b4b", color: "#e0e7ff", minHeight: "100vh" }}>
      <h1 style={{ color: "#a78bfa" }}>dia4</h1>
      <table cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {data.columns.map((c) => (
              <th key={c} style={{ borderBottom: "2px solid #a78bfa", textAlign: "left", color: "#c4b5fd" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i}>
              {data.columns.map((c) => (
                <td key={c} style={{ borderBottom: "1px solid #4c1d95" }}>
                  {String(row[c] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
