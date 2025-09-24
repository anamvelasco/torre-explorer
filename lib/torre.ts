export type TorreBio = any;

export async function fetchGenomeDirect(username: string): Promise<TorreBio> {
  const res = await fetch(
    `https://torre.ai/api/genome/bios/${encodeURIComponent(username)}`,
    { headers: { accept: "application/json" }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Genome fetch failed: ${res.status}`);
  return res.json();
}