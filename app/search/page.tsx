import SearchByName from "@/components/SearchByName";

export default function SearchPage() {
  return (
    <div className="section">
      <SearchByName />
      <div style={{ height: 16 }} />
      <a className="btn ghost" href="/">{`← Volver`}</a>
    </div>
  );
}
