import { headers } from "next/headers";
import ProfileCard from "@/components/ProfileCard";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username);
  let bio: any | null = null;
  let error: string | null = null;

  try {
    // Construye la base URL del request actual (sirve en dev y en Vercel)
    const hdrs = headers();
    const host =
      hdrs.get("x-forwarded-host") || // Vercel/Proxy
      hdrs.get("host");               // Dev local
    const proto =
      hdrs.get("x-forwarded-proto") || // Vercel/Proxy
      (process.env.NODE_ENV === "development" ? "http" : "https");
    const base = `${proto}://${host}`;

    // Llama a TU backend (proxy) en vez de llamar directo a Torre
    const res = await fetch(`${base}/api/torre/genome/${encodeURIComponent(username)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Genome fetch failed: ${res.status}`);
    bio = await res.json();
  } catch (e: any) {
    error = e?.message || "Failed to load profile";
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-pad">
          <div className="small" style={{ color: "#b91c1c" }}>
            @{username}: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="card">
        <div className="card-pad">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h2 className="title" style={{ margin: 0 }}>@{username}</h2>
            <a className="small" href="/">New search</a>
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {bio ? (
        <ProfileCard bio={bio} />
      ) : (
        <div className="card">
          <div className="card-pad">
            <div className="skeleton" style={{ height: 24, width: "66%", marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 16, width: "33%", marginBottom: 24 }} />
            <div className="skeleton" style={{ height: 160, width: "100%" }} />
          </div>
        </div>
      )}
    </div>
  );
}
