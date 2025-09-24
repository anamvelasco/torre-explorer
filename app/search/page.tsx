// app/search/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Person = {
  username: string;
  name: string;
  professionalHeadline?: string;
  location?: string | null;
  picture?: string | null;
};

export default function SearchByNamePage() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialQ = sp.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Person[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // keep URL in sync when submitting the form
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = q.trim();
    router.push(`/search${next ? `?q=${encodeURIComponent(next)}` : ""}`);
  }

  // fetch when query (from URL) changes
  const activeQ = useMemo(() => sp.get("q") ?? "", [sp]);
  useEffect(() => {
    const name = activeQ.trim();
    setResults(null);
    setError(null);

    if (!name) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/torre/search?q=${encodeURIComponent(name)}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok || json?.ok === false) {
          throw new Error(
            json?.upstreamBody ||
              json?.message ||
              `Search failed with status ${r.status}`
          );
        }
        setResults(json.results || []);
      })
      .catch((err) => {
        setError(
          typeof err?.message === "string"
            ? err.message
            : "Unexpected error while searching"
        );
      })
      .finally(() => setLoading(false));
  }, [activeQ]);

  return (
    <div className="section">
      <div className="card">
        <div className="card-pad">
          <h2 className="title">Search people by name</h2>
          <p className="subtitle">Type a name and press Enter.</p>
          <form onSubmit={onSubmit} className="row" style={{ gap: ".5rem" }}>
            <input
              className="input"
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. ana, veronica"
              aria-label="Full name or partial name"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <div className="card-pad">
          <h3 className="h2">Results</h3>

          {loading && (
            <div className="result-list">
              <div className="skeleton" style={{ height: 60, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 60, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 60 }} />
            </div>
          )}

          {!loading && error && (
            <div className="small" style={{ color: "#b91c1c" }}>
              {error}
            </div>
          )}

          {!loading && !error && !activeQ && (
            <div className="small">Type a name above to search.</div>
          )}

          {!loading && !error && activeQ && (results?.length ?? 0) === 0 && (
            <div className="small">No matches found.</div>
          )}

          {!loading && !error && (results?.length ?? 0) > 0 && (
            <div className="result-list">
              {results!.map((p) => (
                <Link
                  key={p.username}
                  href={`/profile/${encodeURIComponent(p.username)}`}
                  className="result-item"
                >
                  {p.picture ? (
                    <img
                      src={p.picture}
                      alt={p.name}
                      className="avatar"
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <div className="avatar">
                      {(p.name || p.username || "?").slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div style={{ minWidth: 0 }}>
                    <div className="result-name">{p.name || p.username}</div>
                    <div className="result-meta">
                      {p.professionalHeadline || "—"}
                      {p.location ? ` · ${p.location}` : ""}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
