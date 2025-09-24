"use client";

type Strength = {
  name?: string;
  proficiency?: string;
  weight?: number;
  recommendations?: number;
};

export default function TopSkills({ strengths = [] as Strength[] }) {
  const items = [...strengths]
    .filter(Boolean)
    .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
    .slice(0, 5);

  if (items.length === 0) return null;

  const max = Math.max(...items.map((s) => s.weight ?? 0), 1);

  return (
    <div className="card">
      <div className="card-pad">
        <h3 className="h2">Top habilidades</h3>
        <div className="space-y-3">
          {items.map((s, idx) => {
            const pct = Math.round(((s.weight ?? 0) / max) * 100);
            return (
              <div key={idx}>
                <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                  <div className="chip">{s.name || "—"}</div>
                  <div className="small">{pct}%</div>
                </div>
                <div className="progress">
                  <div style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
