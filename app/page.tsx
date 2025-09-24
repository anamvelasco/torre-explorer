import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <div className="section">
      <div className="card">
        <div className="card-pad">
          <h2 className="title">Buscar perfil por username</h2>
          <p className="subtitle">
            Ejemplo: <code>rubenjr</code>
          </p>
          <SearchBar />
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <div className="card-pad">
          <h3 className="h2">Ejemplos rápidos</h3>
          <div className="row">
            {["rubenjr", "guillermo", "veronica"].map((u) => (
              <Link key={u} href={`/profile/${u}`} className="chip">
                {u}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <div className="card-pad">
          <Link className="btn" href="/search">
            Buscar por nombre →
          </Link>
        </div>
      </div>
    </div>
  );
}
