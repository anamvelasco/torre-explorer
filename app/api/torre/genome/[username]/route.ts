// app/api/torre/genome/[username]/route.ts
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const url = `https://torre.ai/api/genome/bios/${encodeURIComponent(params.username)}`;

  const upstream = await fetch(url, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
  });
}
