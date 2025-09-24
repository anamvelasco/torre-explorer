// app/page.tsx
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <div className="section">
      <div className="card">
        <div className="card-pad">
          <h2 className="title">Find a profile by username</h2>
          <p className="subtitle">Try: <code>rubenjr</code></p>
          <SearchBar />
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <div className="card-pad">
          <h3 className="h2">Quick examples</h3>
          <div className="row">
            {["rubenjr", "guillermo", "veronica"].map((u) => (
              <a key={u} href={`/profile/${u}`} className="chip">{u}</a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {/* Make this link look like a green primary button */}
      <a className="btn btn-primary" href="/search">Search by name →</a>
    </div>
  );
}
