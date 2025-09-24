// components/ProfileCard.tsx
import StrengthsChart from "@/components/StrengthsChart";

type Bio = any;

function formatLocation(bio: Bio) {
  const loc =
    bio?.person?.location ||
    bio?.person?.locationName ||
    bio?.location ||
    bio?.person?.links?.find?.((l: any) => l.name === "location")?.value;
  return loc || null;
}

function topStrengths(bio: Bio, limit = 6) {
  const arr: any[] = bio?.strengths || bio?.skills || [];
  return arr
    .slice()
    .sort((a, b) => (b?.weight ?? 0) - (a?.weight ?? 0))
    .slice(0, limit);
}

function jobs(bio: Bio) {
  const arr: any[] = bio?.experiences || bio?.jobs || bio?.employment || [];
  return arr.slice(0, 5);
}

function education(bio: Bio) {
  const arr: any[] = bio?.education || bio?.studies || [];
  return arr.slice(0, 4);
}

export default function ProfileCard({ bio }: { bio: Bio }) {
  const person = bio?.person || {};
  const name = person?.name || bio?.name || "—";
  const headline = person?.professionalHeadline || bio?.professionalHeadline || "—";
  const location = formatLocation(bio);
  const picture = person?.picture || person?.avatar || null;

  const strengths = topStrengths(bio, 6);
  const radarData = (bio?.strengths || [])
    .slice(0, 6)
    .map((s: any) => ({
      name: s?.name ?? "",
      value: Number(s?.weight ?? s?.proficiency ?? 0),
    }));

  return (
    <div className="card">
      <div className="card-pad">
        {/* Header */}
        <div className="row" style={{ gap: "1rem", alignItems: "center" }}>
          {picture ? (
            <img
              src={picture}
              alt={name}
              className="avatar"
              style={{ width: 64, height: 64, borderRadius: "50%" }}
            />
          ) : (
            <div className="avatar" style={{ width: 64, height: 64, fontSize: 24 }}>
              {(name || "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div className="title" style={{ margin: 0 }}>{name}</div>
            <div className="subtitle" style={{ marginTop: 2 }}>
              {headline}{location ? ` · ${location}` : ""}
            </div>
          </div>
        </div>

        {/* Strengths chips */}
        {strengths?.length ? (
          <>
            <div style={{ height: 16 }} />
            <h3 className="h2" style={{ marginBottom: 8 }}>Top strengths</h3>
            <div className="row" style={{ flexWrap: "wrap", gap: ".5rem" }}>
              {strengths.map((s: any) => (
                <span className="chip" key={s?.id || s?.name}>
                  {s?.name ?? "—"}
                </span>
              ))}
            </div>
          </>
        ) : null}

        {/* Radar */}
        {radarData?.length ? (
          <>
            <div style={{ height: 16 }} />
            <h3 className="h2" style={{ marginBottom: 8 }}>Strengths radar</h3>
            <div style={{ width: "100%", height: 300 }}>
              <StrengthsChart data={radarData} />
            </div>
          </>
        ) : null}

        {/* Experience */}
        {jobs(bio)?.length ? (
          <>
            <div style={{ height: 16 }} />
            <h3 className="h2" style={{ marginBottom: 8 }}>Experience</h3>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {jobs(bio).map((j: any, i: number) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <div className="result-name" style={{ fontWeight: 600 }}>
                    {j?.name || j?.role || j?.position || "—"}
                  </div>
                  <div className="result-meta">
                    {j?.organizations?.[0]?.name || j?.organization || j?.company || "—"}
                    {j?.fromMonth || j?.toMonth || j?.fromYear || j?.toYear ? (
                      <>
                        {" · "}
                        {[
                          j?.fromMonth && j?.fromYear ? `${j.fromMonth}/${j.fromYear}` : null,
                          j?.toMonth && j?.toYear ? `${j.toMonth}/${j.toYear}` : "Present",
                        ]
                          .filter(Boolean)
                          .join(" – ")}
                      </>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {/* Education */}
        {education(bio)?.length ? (
          <>
            <div style={{ height: 16 }} />
            <h3 className="h2" style={{ marginBottom: 8 }}>Education</h3>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              {education(bio).map((e: any, i: number) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <div className="result-name" style={{ fontWeight: 600 }}>
                    {e?.name || e?.degree || "—"}
                  </div>
                  <div className="result-meta">
                    {e?.organizations?.[0]?.name || e?.organization || e?.school || "—"}
                    {e?.fromYear || e?.toYear ? ` · ${e?.fromYear ?? "—"} – ${e?.toYear ?? "Present"}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
