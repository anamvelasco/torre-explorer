"use client";

import { useState } from "react";

type Person = {
  username: string | null;
  name: string | null;
  professionalHeadline?: string | null;
  location?: string | null;
  picture?: string | null;
};

export default function SearchByName() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Person[] | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch(`/api/torre/search?q=${encodeURIComponent(term)}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      const list: Person[] = (data?.results || []).filter((r: any) => r?.username);
      setResults(list);
    } catch (err: any) {
      setError(err?.message || "Error de búsqueda");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card-pad">
        <h2 className="title">Search by name</h2>
        <form onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Ej: ana"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div style={{ height: 12 }} />
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Buscando…" : "Buscar"}
          </button>
        </form>

        <div style={{ height: 24 }} />
        <h3 className="h2">Results</h3>

        {error && <div className="small" style={{ color: "#b91c1c" }}>{error}</div>}
        {loading && <div className="small">Loading...</div>}
        {results === null && !loading && <div className="muted">No results yet.</div>}
        {results && results.length === 0 && !loading && (
          <div className="muted">No matches found.</div>
        )}

        {results && results.length > 0 && (
          <div className="col">
            {results.map((p) => (
              <a
                key={p.username!}
                href={`/profile/${encodeURIComponent(p.username!)}`}
                className="row"
                style={{
                  alignItems: "center",
                  padding: "10px 0",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                }}
              >
                <img
                  src={p.picture || `https://avatar.tobi.sh/${p.username}.png`}
                  alt=""
                  width={36}
                  height={36}
                  style={{ borderRadius: 999, marginRight: 12, objectFit: "cover" }}
                />
                <div className="col">
                  <div className="title-sm">{p.name || `@${p.username}`}</div>
                  <div className="small muted">
                    @{p.username}
                    {p.professionalHeadline ? ` • ${p.professionalHeadline}` : ""}
                    {p.location ? ` • ${p.location}` : ""}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
