import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <div className="section">
      <div className="card">
        <div className="card-pad">
          <h2 className="title">Buscar perfil por username</h2>
          <p className="subtitle">Ejemplo: <code>rubenjr</code></p>
          <SearchBar />
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <div className="card-pad">
          <h3 className="h2">Ejemplos rápidos</h3>
          <div className="row">
            {["rubenjr", "guillermo", "veronica"].map((u) => (
              <a key={u} href={`/profile/${u}`} className="chip">{u}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
