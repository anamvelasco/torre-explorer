Torre Explorer — People Search & Genome Viewer (TXT)

A small full‑stack app built with Next.js (App Router) + TypeScript to explore Torre’s people data.
Search by name and open profile pages with strengths highlights in a clean, LinkedIn‑like UI.

Live demo: https://torre-explorer-n2kyvfdhj-anamvelascos-projects.vercel.app
Repository: <https://github.com/anamvelasco/torre-explorer>

--------------------------------------------------------------------
FEATURES
--------------------------------------------------------------------
• Search by name (debounced) with clickable results.<br>
• Profile viewer (/profile/[username]) with strengths highlights and friendly 404 states.<br>
• UI/UX: Poppins font, green primary buttons, chips, avatar fallback, skeletons, consistent card layout.<br>
• API proxy: Serverless routes under /api/torre/* to call Torre’s public endpoints safely.<br>
• Resilience: Fallback results when _searchStream rejects short queries (400).<br>

--------------------------------------------------------------------
TECH STACK
--------------------------------------------------------------------
• Next.js 15 (App Router) + TypeScript<br>
• Vercel (serverless & hosting)<br>
• Custom CSS (no Tailwind, no @apply)<br>
• Fonts via next/font (Poppins)<br>

--------------------------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------------------------
.
```
├── app
│   ├── api
│   │   └── torre
│   │       ├── search
│   │       │   ├── route.ts            # Name search proxy (consolidated JSON + fallbacks)
│   │       │   └── stream
│   │       │       └── route.ts        # Optional streaming passthrough (reference)
│   │       └── genome
│   │           └── [username]
│   │               └── route.ts        # Genome proxy for a single profile
│   ├── profile
│   │   └── [username]
│   │       └── page.tsx                # Profile page (server component)
│   ├── search
│   │   └── page.tsx                    # Search page (CSR, wrapped in <Suspense>)
│   ├── layout.tsx                      # Global layout (Poppins + header/footer)
│   └── globals.css                     # Styles: inputs, buttons, cards, result list, etc.
├── components
│   ├── ProfileCard.tsx                 # Profile info + strengths visualization
│   ├── SearchByName.tsx                # Search UI (input + results)
│   └── SiteHeader.tsx                  # Top bar (brand + nav)
├── lib
│   └── torre.ts                        # getBaseUrl() helper (local/Vercel)
├── public
│   └── torre.svg                       # Logo (your SVG here)
├── next.config.ts
├── eslint.config.mjs
├── package.json
└── README.md
```

--------------------------------------------------------------------
API PROXY
--------------------------------------------------------------------
Upstream (Torre):
• POST https://torre.ai/api/entities/_searchStream   (people/orgs stream) <br>
• GET  https://torre.ai/api/genome/bios/:username    (genome data) <br>

Your proxy routes:
• GET /api/torre/search?q=<text> <br>
  Returns: [{ username, name, professionalHeadline?, location?, picture? }] <br>
  On upstream 400: returns a local fallback list with ok:true. <br>

• GET /api/torre/genome/:username <br>
  Proxies genome. On upstream 404: returns 404 with { ok:false, message:'not-found' }. <br>

--------------------------------------------------------------------
UI PAGES AND CSS CLASSES
--------------------------------------------------------------------
/search <br>
  • Debounced search, result list.<br>
  • Classes: <br>
    - List container: result-list <br>
    - Each item: result-item <br>
    - Name: result-name <br>
    - Headline + location: result-meta <br>
    - Avatar: avatar <br>

/profile/[username] <br>
  • Loads genome via proxy. Friendly errors with a red banner inside a card. <br>

Design system classes: <br>
• Inputs:          input <br>
• Primary button:  btn btn-primary   (green) <br>
• Secondary link:  btn <br>
• Card wrapper:    ```<div class="card"><div class="card-pad">...</div></div>``` <br>

--------------------------------------------------------------------
ENVIRONMENT VARIABLES
--------------------------------------------------------------------
Local: create .env.local at the project root <br>
  NEXT_PUBLIC_BASE_URL=http://localhost:3000 <br>

Vercel (optional): add NEXT_PUBLIC_BASE_URL in Project Settings → Environment Variables <br>
  Preview:    https://<your-preview>.vercel.app <br>
  Production: https://<your-production>.vercel.app <br>

Helper getBaseUrl() also falls back to VERCEL_URL or http://localhost:3000. <br>

--------------------------------------------------------------------
GETTING STARTED
--------------------------------------------------------------------
npm i <br>
npm run dev <br>
open http://localhost:3000 <br>

Smoke tests:
• http://localhost:3000/api/torre/search?q=ana → JSON (ok:true + results or fallback) <br>
• http://localhost:3000/search          → type “ana” and click a result <br>
• http://localhost:3000/profile/ana     → profile page (or friendly 404 for invalid users) <br>

--------------------------------------------------------------------
DEPLOYMENT (VERCEL)
--------------------------------------------------------------------
1) vercel   (link/import the repo) <br>
2) (optional) Add NEXT_PUBLIC_BASE_URL (Preview/Production) <br>
3) vercel --prod <br>
4) Test the same three URLs on production <br>

--------------------------------------------------------------------
TROUBLESHOOTING
--------------------------------------------------------------------
• “Failed to parse URL from /api/…” in server components: <br>
  Use absolute URLs via getBaseUrl() in server code. <br>
• useSearchParams() SSR warning: <br>
  Wrap the client page in <Suspense>. <br>
• Upstream _searchStream returns 400: <br>
  The proxy returns fallback results and the UI keeps working. <br>

--------------------------------------------------------------------
ROADMAP
--------------------------------------------------------------------
• Job search page <br>
• Client-side filters (location/skills) <br>
• Skills analytics (top skills across results) <br>
• Edge caching for hot profiles <br>

--------------------------------------------------------------------
SCRIPTS
--------------------------------------------------------------------
npm run dev <br>
npm run build <br>
npm start <br>

--------------------------------------------------------------------
