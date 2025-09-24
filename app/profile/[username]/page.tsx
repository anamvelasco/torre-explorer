import ProfileCard from "@/components/ProfileCard";
import { headers } from "next/headers";

/** Construye una URL base absoluta (funciona local y en deploy) */
function getBaseUrl(): string {
  // 1) Si definiste una URL en variables de entorno, úsala
  const env =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.VERCEL_URL; // en Vercel viene sin protocolo

  if (env) {
    const hasProto = env.startsWith("http://") || env.startsWith("https://");
    return (hasProto ? env : `https://${env}`).replace(/\/$/, "");
  }

  // 2) Caso general: tomar host/proto del request
  const h = headers(); // ¡OJO! NO se espera con await.
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    "localhost:3000";
  return `${proto}://${host}`;
}

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const username = decodeURIComponent(params.username);
  const base = getBaseUrl();

  let bio: any | null = null;
  let notFound = false;
  let error: string | null = null;

  try {
    const res = await fetch(
      `${base}/api/torre/genome/${encodeURIComponent(username)}`,
      {
        headers: { accept: "application/json" },
        cache: "no-store",
      }
    );

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      if (res.status === 404 || data?.notFound) {
        notFound = true;
      } else {
        error = data?.error || `Genome fetch failed: ${res.status}`;
      }
    } else {
      bio = data;
    }
  } catch (e: any) {
    error = e?.message || "Error al cargar el perfil";
  }

  if (notFound) {
    return (
      <div className="section">
        <div className="card">
          <div className="card-pad">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2 className="title" style={{ margin: 0 }}>@{username}</h2>
              <a className="small" href="/search">Volver a buscar</a>
            </div>
            <div style={{ height: 12 }} />
            <div className="small muted">
              No encontramos el genome de @{username} en Torre. Prueba con otro resultado.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="card">
          <div className="card-pad">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2 className="title" style={{ margin: 0 }}>@{username}</h2>
              <a className="small" href="/search">Volver a buscar</a>
            </div>
            <div style={{ height: 12 }} />
            <div className="small" style={{ color: "#b91c1c" }}>{error}</div>
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
            <a className="small" href="/search">Volver a buscar</a>
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
