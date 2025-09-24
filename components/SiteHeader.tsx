export default function SiteHeader() {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="/" className="brand">
          <img src="/torre.svg" alt="Torre" />
          <span>Torre Explorer</span>
        </a>

        <nav style={{ marginLeft: "auto", display: "flex", gap: ".5rem" }}>
          <a className="btn" href="/">Inicio</a>
          <a className="btn btn-primary" href="/search">Buscar por nombre</a>
        </nav>
      </div>
    </header>
  );
}
