import ProfileCard from "@/components/ProfileCard";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username);
  let bio: any | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`https://torre.ai/api/genome/bios/${encodeURIComponent(username)}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Genome fetch failed: ${res.status}`);
    bio = await res.json();
  } catch (e: any) {
    error = e?.message || "Failed to load profile";
  }

  if (error) {
    return (
      <div className="card"><div className="card-pad">
        <div className="small" style={{ color: "#b91c1c" }}>@{username}: {error}</div>
      </div></div>
    );
  }

  return (
    <div className="section">
      <div className="card"><div className="card-pad">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 className="title" style={{ margin: 0 }}>@{username}</h2>
          <a className="small" href="/">New search</a>
        </div>
      </div></div>

      <div style={{ height: 16 }} />

      {bio ? (
        <ProfileCard bio={bio} />
      ) : (
        <div className="card"><div className="card-pad">
          <div className="skeleton" style={{ height: 24, width: "66%", marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 16, width: "33%", marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 160, width: "100%" }} />
        </div></div>
      )}
    </div>
  );
}
