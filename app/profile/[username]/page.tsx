import { fetchGenomeDirect } from "@/lib/torre";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username);
  let bio: any = null, error: string | null = null;

  try {
    bio = await fetchGenomeDirect(username);
  } catch (e: any) {
    error = e?.message || "Error cargando perfil";
  }

  if (error) {
    return <div style={{ padding: 20 }}>@{username}: {error}</div>;
  }

  const person = bio?.person || {};
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>{person.name || "Sin nombre"}</h1>
      <p style={{ opacity: 0.8 }}>{person.professionalHeadline || "Sin headline"}</p>
      {person.locationName && <p>📍 {person.locationName}</p>}
      {person.username && (
        <p><a href={`https://torre.ai/${person.username}`} target="_blank">Ver en Torre ↗</a></p>
      )}
    </div>
  );
}
