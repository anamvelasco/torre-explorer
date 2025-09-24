import StrengthsChart from "./StrengthsChart";

type Strength = { id?: string; name?: string; weight?: number };
type Experience = {
  name?: string; fromMonth?: number; fromYear?: number; toMonth?: number; toYear?: number;
  organizations?: { name?: string }[];
};
type Education = {
  name?: string; fromYear?: number; toYear?: number; organizations?: { name?: string }[];
};

type Bio = {
  person?: {
    name?: string; professionalHeadline?: string; locationName?: string;
    links?: { name?: string; address?: string }[]; username?: string;
  };
  strengths?: Strength[]; experiences?: Experience[]; education?: Education[];
};

export default function ProfileCard({ bio }: { bio: Bio }) {
  const person = bio.person || {};
  const strengths = (bio.strengths || []).slice(0, 12);

  const radar = strengths
    .filter((s) => typeof s.weight === "number")
    .slice(0, 6)
    .map((s) => ({ name: s.name || "—", value: Math.max(1, Math.round(((s.weight || 1) as number) * 100)) }));

  const experiences = (bio.experiences || []).slice(0, 6);
  const education = (bio.education || []).slice(0, 4);

  return (
    <div className="card">
      <div className="card-pad">
        <h1 className="title" style={{ marginBottom: 6 }}>{person.name || "Unknown"}</h1>
        {person.professionalHeadline && <p className="muted" style={{ marginTop: 0 }}>{person.professionalHeadline}</p>}

        <div className="muted" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
          {person.locationName && <span>📍 {person.locationName}</span>}
          {person.username && (
            <a href={`https://torre.ai/${person.username}`} target="_blank" className="muted">View on Torre ↗</a>
          )}
          {(person.links || [])
            .filter((l) => l?.address)
            .slice(0, 3)
            .map((l, i) => (
              <a key={i} href={l!.address!} target="_blank" rel="noreferrer" className="muted">
                {l!.name || "Link"} ↗
              </a>
            ))}
        </div>
      </div>

      <div className="card-pad">
        <div className="grid-2">
          <section className="card" style={{ border: "none", boxShadow: "none" }}>
            <div className="card-pad">
              <h2 className="h2">Top strengths</h2>
              {strengths.length === 0 ? (
                <div className="muted">No strengths found.</div>
              ) : (
                <div className="row">
                  {strengths.map((s, i) => <span key={i} className="chip">{s.name || "—"}</span>)}
                </div>
              )}
            </div>
          </section>

          <section className="card" style={{ border: "none", boxShadow: "none" }}>
            <div className="card-pad">
              <h2 className="h2">Strengths radar</h2>
              {radar.length === 0 ? (
                <div className="muted">Not enough data.</div>
              ) : (
                <div style={{ height: 280 }}>
                  <StrengthsChart data={radar} />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="card-pad">
        <div className="grid-2">
          <section className="card" style={{ border: "none", boxShadow: "none" }}>
            <div className="card-pad">
              <h2 className="h2">Experience</h2>
              {experiences.length === 0 ? (
                <div className="muted">No experience listed.</div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {experiences.map((e, i) => (
                    <li key={i} style={{ marginBottom: 10, lineHeight: 1.2 }}>
                      <div style={{ fontWeight: 600 }}>{e.name || "—"}</div>
                      <div className="muted">
                        {e.organizations?.[0]?.name ? `${e.organizations?.[0]?.name} • ` : ""}
                        {fmtRange(e.fromMonth, e.fromYear, e.toMonth, e.toYear)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="card" style={{ border: "none", boxShadow: "none" }}>
            <div className="card-pad">
              <h2 className="h2">Education</h2>
              {education.length === 0 ? (
                <div className="muted">No education listed.</div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {education.map((e, i) => (
                    <li key={i} style={{ marginBottom: 10, lineHeight: 1.2 }}>
                      <div style={{ fontWeight: 600 }}>{e.name || "—"}</div>
                      <div className="muted">
                        {e.organizations?.[0]?.name ? `${e.organizations?.[0]?.name} • ` : ""}
                        {fmtRange(undefined, e.fromYear, undefined, e.toYear)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function fmtRange(fromM?: number, fromY?: number, toM?: number, toY?: number) {
  const from = [fromM, fromY].filter(Boolean).join("/");
  const to = [toM, toY].filter(Boolean).join("/");
  return `${from || "—"} – ${to || "present"}`;
}
