import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const { username } = params;
  const url = `https://torre.ai/api/genome/bios/${encodeURIComponent(username)}`;

  try {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    const text = await res.text();

    // Intenta JSON; si no, forwardea tal cual (algunos perfiles devuelven text/html o similar)
    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return new NextResponse(text, {
        status: res.status,
        headers: { "content-type": res.headers.get("content-type") || "application/json" },
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upstream error" }, { status: 500 });
  }
}
