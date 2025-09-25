# Prompts Log (Detailed, Prompts-Only)

This file lists the **prompts I used** (no responses).  
Each entry includes **Tool** and **Model**, plus a clear **Context** and **Acceptance Criteria** inside the prompt itself.


### Genome proxy (single profile) with friendly 404
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:**
Act as a full-stack engineer please create an App Router handler at `/api/torre/genome/[username]` that fetches `GET https://torre.ai/api/genome/bios/{username}`.
**Requirements:**
- Pass through `200` JSON as-is in `data` field: `{ ok: true, data: <genome> }`.
- If upstream is `404`, return `{ ok: false, notFound: true }` (no thrown error).
- Other errors → `{ ok: false, upstreamStatus, upstreamBody }`.
- Strict TypeScript types; avoid `any`; create minimal interfaces typed for the top fields we use (bio name, strengths, picture).
**Acceptance Criteria:**
- Gracefully handles `404` and unexpected upstream errors.
- No unhandled promise rejections.

---

### Profile page (server component) with graceful 404 card
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:**
Act as a full-stack engineer, create `/app/profile/[username]/page.tsx` as a **server component** that:
- Uses `getBaseUrl()` to fetch `/api/torre/genome/:username`.
- If `{ ok:false, notFound:true }`, render a `.card` with:
  - Title “Profile not found”
  - A secondary `.btn` linking back to `/search`
- If `{ ok:true }`, render profile header (name, headline, location, picture) + `<ProfileCard />`.
- Never attempt to read `headers().get(...)` without `await headers()`. Keep TypeScript strict.
**Acceptance Criteria:**
- Works both locally and on Vercel.
- 404 never crashes the page; navigation back is clear.

---

## ProfileCard component (summary + strengths with safe fallbacks)
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:**
Act as a full-stack engineer. Implement `components/ProfileCard.tsx` that accepts strongly-typed props from the genome:
- Show picture (or fallback letter avatar), name, headline, location.
- Show first ~6 strengths (name + weight) with badges or a minimal visual indicator (no external chart libs).
- If strengths missing/short, degrade gracefully (e.g., “No strengths available”).
- Provide a small “Similar profiles” section linking back to `/search?q=<first_name>`.
**Acceptance Criteria:**
- No `any` types; props interfaces are explicit.
- Layout does not break if fields are `null`.


---

## Error boundary and empty states polish
**Tool:** ChatGPT  
**Model:** GPT-4o  
**Prompt:**
Act as a full-stack engineer and provide a small error boundary or defensive UI patterns for:
- `/search` list (show a non-blocking error chip if the API returns `{ ok:false }`).
- `/profile/[username]` (if genome fetch fails with non-404, show a retry button and a link back).
- Keep copy text short and friendly in **English** only.
**Acceptance Criteria:**
- Errors never crash the page.
- Clear guidance to retry or navigate back.

---
