// app/profile/[username]/page.tsx
import ProfileCard from "@/components/ProfileCard";
import { headers } from "next/headers";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const username = decodeURIComponent(params.username);

  // Construimos un origin absoluto para evitar "Failed to parse URL from /api/..."
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const res = await fetch(
    `${origin}/api/torre/genome/${encodeURIComponent(username)}`,
    { cache: "no-store", headers: { accept: "application/json" } }
  );

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = { ok: false, upstreamStatus: res.status, upstreamBody: "Invalid JSON" };
  }

  if (!data?.ok) {
    return (
      <div className="section">
        <div className="card">
          <div className="card-pad">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2 className="title" style={{ margin: 0 }}>@{username}</h2>
              <a className="btn" href="/search">Back to search</a>
            </div>
            <div style={{ height: 8 }} />
            <div className="small" style={{ color: "#b91c1c" }}>
              {data?.upstreamStatus === 404
                ? "Profile not found (404). It may not exist or be private."
                : `Upstream error: ${data?.upstreamStatus ?? "unknown"}`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bio = data.bio;

  return (
    <div className="section">
      <div className="card">
        <div className="card-pad">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2 className="title" style={{ margin: 0 }}>@{username}</h2>
            <a className="btn" href="/search">New search</a>
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <ProfileCard bio={bio} />
    </div>
  );
}
