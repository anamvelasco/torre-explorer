// app/api/torre/search/route.ts
import { NextResponse } from "next/server";

const TORRE_URL = "https://torre.ai/api/entities/_searchStream";

// Datos locales de respaldo (para que tu demo NO se caiga)
const FALLBACK = [
  { username: "rubenjr", name: "Ruben Junior", professionalHeadline: "Engineer @Torre", location: "Remote", picture: null },
  { username: "guillermo", name: "Guillermo Pérez", professionalHeadline: "Full-stack Dev", location: "Bogotá", picture: null },
  { username: "veronica", name: "Verónica Díaz", professionalHeadline: "Product Manager", location: "CDMX", picture: null },
  { username: "anamvelasco", name: "Ana María Velasco", professionalHeadline: "Frontend Engineer", location: "Colombia", picture: null },
  { username: "anagomez", name: "Ana Gómez", professionalHeadline: "UI/UX Designer", location: "Buenos Aires", picture: null },
  { username: "ana", name: "Ana", professionalHeadline: "Software Developer", location: "Remote", picture: null },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  if (!q) return NextResponse.json({ ok: true, results: [] });

  try {
    // probamos varias formas de payload conocidas
    const payloads = [
      { q, types: ["person"], limit: 25 },
      { query: { text: q }, types: ["person"], limit: 25 },
      { query: { and: [{ name: { text: q } }] }, types: ["person"], limit: 25 },
    ];

    let upstream: Response | null = null;
    let lastText = "";
    for (const body of payloads) {
      upstream = await fetch(TORRE_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/x-ndjson, application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      if (upstream.ok) break;
      lastText = await upstream.text().catch(() => "");
    }

    if (upstream?.ok) {
      const ct = upstream.headers.get("content-type") || "";
      const results: any[] = [];

      if (ct.includes("ndjson")) {
        const text = await upstream.text();
        for (const raw of text.split("\n")) {
          const line = raw.trim();
          if (!line) continue;
          try {
            const obj = JSON.parse(line);
            const item = obj?.data ?? obj;
            results.push(normalize(item));
          } catch {}
        }
      } else {
        const data = await upstream.json();
        const arr = Array.isArray(data) ? data : (data.results || data.hits || []);
        for (const it of arr) results.push(normalize(it));
      }
      return NextResponse.json({ ok: true, results });
    }

    // Fallback si la API devuelve 4xx/5xx
    const fallback = filterFallback(q);
    return NextResponse.json({
      ok: true,
      results: fallback,
      note: "fallback-results",
    });
  } catch (e: any) {
    const fallback = filterFallback(q);
    return NextResponse.json({
      ok: true,
      results: fallback,
      note: "fallback-exception",
      detail: e?.message || String(e),
    });
  }
}

function filterFallback(q: string) {
  return FALLBACK.filter(
    (p) =>
      p.name?.toLowerCase().includes(q) ||
      p.username?.toLowerCase().includes(q) ||
      p.professionalHeadline?.toLowerCase().includes(q)
  ).slice(0, 20);
}

function normalize(item: any) {
  const username =
    item?.username ||
    item?.publicId ||
    item?.person?.username ||
    item?.user?.username ||
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
    null;

  const picture = item?.picture || item?.person?.picture || null;

  return { username, name, professionalHeadline, location, picture, raw: item };
}
