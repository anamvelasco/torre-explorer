// app/api/torre/search/stream/route.ts
import { NextResponse } from "next/server";

const TORRE_URL = "https://torre.ai/api/entities/_searchStream";

// Intentamos varios payloads mínimos conocidos.
// El primero suele ser suficiente; el segundo es respaldo.
const buildCandidatePayloads = (q: string) => ([
  { q, types: ["person"], limit: 25 },
  { query: q, types: ["person"], limit: 25 },
]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ ok: true, results: [] });
  }

  try {
    let upstream: Response | null = null;
    let lastText = "";
    for (const body of buildCandidatePayloads(q)) {
      upstream = await fetch(TORRE_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "accept": "application/x-ndjson, application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      if (upstream.ok) break;
      lastText = await upstream.text().catch(() => "");
    }

    if (!upstream || !upstream.ok) {
      return NextResponse.json(
        { ok: false, upstreamStatus: upstream?.status ?? 502, upstreamBody: lastText || "upstream error" },
        { status: 502 }
      );
    }

    const ct = upstream.headers.get("content-type") || "";
    const results: any[] = [];

    if (ct.includes("application/json") && !ct.includes("ndjson")) {
      const data = await upstream.json();
      const arr = Array.isArray(data) ? data : (data.results || data.hits || []);
      for (const item of arr) results.push(normalize(item));
    } else {
      // NDJSON
      const text = await upstream.text();
      for (const rawLine of text.split("\n")) {
        const line = rawLine.trim();
        if (!line) continue;
        try {
          const obj = JSON.parse(line);
          const item = obj?.data ?? obj;
          results.push(normalize(item));
        } catch {
          // ignora líneas que no sean JSON
        }
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "search stream failed", detail: e?.message || String(e) },
      { status: 500 }
    );
  }
}

function normalize(item: any) {
  // Heurísticas para cubrir distintos formatos que puede enviar Torre
  const username =
    item?.username ||
    item?.publicId ||
    item?.person?.username ||
    item?.user?.username ||
    item?.metadata?.username ||
    null;

  const name =
    item?.name ||
    [item?.person?.name?.first, item?.person?.name?.last].filter(Boolean).join(" ").trim() ||
    item?.person?.name ||
    item?.user?.name ||
    null;

  const professionalHeadline =
    item?.professionalHeadline ||
    item?.person?.professionalHeadline ||
    item?.headline ||
    item?.user?.professionalHeadline ||
    null;

  const location =
    item?.locationName ||
    item?.person?.locationName ||
    item?.location ||
    item?.city ||
    null;

  const picture =
    item?.picture ||
    item?.person?.picture ||
    item?.photo ||
    item?.image ||
    null;

  return { username, name, professionalHeadline, location, picture, raw: item };
}
