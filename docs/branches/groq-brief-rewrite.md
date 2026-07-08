# Branch: `feature/groq-brief-rewrite`

**Parent:** [GROQ_PLAN.md](../GROQ_PLAN.md) · **Order:** 1 of 3 (required)  
**Status:** Complete — merged in PR #2 (`e293498`)  
**Depends on:** `feature/groq-client`, frozen trend shape in `data/trends.json`

Daily brief endpoint. LLM rewrites `summary` tone only; all numbers stay curated.

---

## Scope

- `lib/brief.js` — `getBrief()`, rewrite logic, daily cache
- `app/api/brief/route.js` — `GET` handler

## Out of scope

- Contrast headline generation (stays static from data)
- Chat endpoint
- Frontend changes (Person C wires separately)
- Structured output / JSON schema (Branch 3)

---

## Implementation

### `getBrief()` flow

```
1. If cache hit for today's date → return cached brief
2. Load trends + contrast from lib/data.js
3. If hasGroqKey():
     try rewriteSummaries(trends) → rewritten = true
     catch → keep curated trends, log error
4. Build { date, trends, contrast, rewritten }
5. Cache and return
```

### Rewrite prompt

**System:** Editor voice. Rewrite only `summary` into ~2 plain-English sentences.  
**Hard rules:** Never change numbers, years, percentages, or facts. No invented sources.  
**Output:** JSON array only: `[{"id":"...","summary":"..."}]` — no markdown.

**User message:** `JSON.stringify` of `[{ id, metric, metricLabel, summary }]`

**Temperature:** `0.4`

### Parsing (defensive)

1. Strip `` ```json `` / `` ``` `` from reply
2. `JSON.parse` → array
3. Map by `id`; missing id → keep curated `summary` for that trend
4. Any throw → fall back to all curated summaries

### `GET /api/brief`

- `export const dynamic = "force-dynamic"`
- Returns `NextResponse.json(await getBrief())`
- 500 only on unexpected errors (not Groq failures — those fall back)

### Response shape

```json
{
  "date": "2026-07-06",
  "trends": [ /* full trend objects, summary possibly rewritten */ ],
  "contrast": { "headline": {}, "trend": {} },
  "rewritten": true
}
```

---

## Manual test

**Without key** (`GROQ_API_KEY` unset):

```bash
curl http://localhost:3000/api/brief
```

- [ ] 200, all trends present, `rewritten: false`
- [ ] Summaries match `data/trends.json`

**With key:**

- [ ] 200, `rewritten: true`
- [ ] Every number in rewritten summaries appears in the original JSON for that trend
- [ ] Hit endpoint twice → same response; check server logs for single Groq call

**Simulated failure:** Temporarily break the prompt or use a bad key mid-request → brief still returns curated text.

---

## Merge checklist

- [x] `GET /api/brief` works with and without `GROQ_API_KEY`
- [x] Groq failure does not 500 the brief
- [x] Daily in-memory cache works
- [x] No frontend files in this PR

---

## PR description template

```
## What
GET /api/brief with optional LLM summary rewrite (tone only).

## Test
- No key: curated summaries, rewritten=false
- With key: polished summaries, rewritten=true, numbers unchanged
- Second request same day: cached (no extra Groq call)
```
