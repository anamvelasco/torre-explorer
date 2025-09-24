// app/api/torre/genome/[username]/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  const username = params?.username;
  if (!username) {
    return NextResponse.json({ ok: false, message: "Missing username" }, { status: 200 });
  }

  try {
    const upstream = await fetch(
      `https://torre.ai/api/genome/bios/${encodeURIComponent(username)}`,
      { headers: { accept: "application/json" }, cache: "no-store" }
    );

    const text = await upstream.text();

    // Siempre devolvemos 200 para que el front pueda leer {ok:false,...} y mostrar un mensaje amistoso.
    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, upstreamStatus: upstream.status, upstreamBody: text },
        { status: 200 }
      );
    }

    let bio: any = null;
    try {
      bio = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { ok: false, upstreamStatus: upstream.status, upstreamBody: text },
        { status: 200 }
      );
    }

    return NextResponse.json({ ok: true, bio }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, upstreamStatus: 0, upstreamBody: String(err?.message || err) },
      { status: 200 }
    );
  }
}
