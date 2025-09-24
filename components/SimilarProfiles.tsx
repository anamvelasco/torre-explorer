"use client";

import { useEffect, useState } from "react";

type Person = {
  username: string;
  name?: string;
  professionalHeadline?: string;
  location?: string;
  picture?: string | null;
};

export default function SimilarProfiles({
  seedName,
  excludeUsername,
}: {
  seedName: string;
  excludeUsername?: string;
}) {
  const [items, setItems] = useState<Person[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setItems(null);
    setErr(null);
    const q = seedName.split(/\s+/)[0] || seedName;

    fetch(`/api/torre/search?q=${encodeURIComponent(q)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Search failed: ${r.status}`);
        const data = await r.json();
        const results = ((data?.results ?? data) || []) as Person[];
        const filtered = results.filter((p) => p.username !== excludeUsername).slice(0, 6);
        if (!ignore) setItems(filtered);
      })
      .catch((e) => !ignore && setErr(e?.message || "Error"));

    return () => {
      ignore = true;
    };
  }, [seedName, excludeUsername]);

  if (err) return null;

  if (!items) {
    return (
      <div className="card">
        <div className="card-pad">
          <h3 className="h2">Similar profiles</h3>
          <div className="grid-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="card">
      <div className="card-pad">
        <h3 className="h2">Similar profiles</h3>
        <div className="grid-3">
          {items.map((p) => (
            <a key={p.username} href={`/profile/${encodeURIComponent(p.username)}`} className="card-mini">
              <div
                className="avatar"
                style={{ backgroundImage: p.picture ? `url(${p.picture})` : undefined }}
              />
              <div className="mini-title">{p.name || p.username}</div>
              <div className="mini-subtitle">{p.professionalHeadline || "—"}</div>
              <div className="mini-meta">{p.location || ""}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
