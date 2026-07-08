# Groq Integration Plan

Anchor document for Person B (LLM & chat). Each branch gets its own detail plan
before work starts. Keep branches small, merge in order, demo after each merge.

**Status:** v1 is already implemented in the repo. This plan maps how it was (and
should be) built incrementally, and what optional hardening comes next.

---

## Role in the product

Groq powers two jobs — nothing else:

| Job | Endpoint | LLM does | LLM must not do |
|-----|----------|----------|-----------------|
| **Brief rewrite** | `GET /api/brief` | Rewrite `summary` tone into plain English | Change numbers, years, sources, or facts |
| **Grounded chat** | `POST /api/chat` | Answer questions about today's data | Invent figures or answer outside the dataset |

All facts live in curated data (`data/trends.json` today, `lib/data.js` later).
The LLM is a tone and Q&A layer on top — not a data source.

---

## Design principles

1. **Two jobs, two prompts** — rewrite (structured JSON out) and chat (plain text).
2. **Fail open on brief, fail closed on chat** — the brief always renders; chat can be unavailable.
3. **No SDK** — `fetch` to Groq's OpenAI-compatible API (`lib/groq.js`).
4. **Low temperature** — `0.3` for chat, `0.4` for rewrite.
5. **Default model** — `llama-3.3-70b-versatile` (override via `GROQ_MODEL`).
6. **Graceful degradation** — no `GROQ_API_KEY` → curated summaries, helpful chat message.

---

## Branch sequence

Merge in order. Each branch should be demoable on its own.

```
groq/client  →  groq/brief-rewrite  →  groq/chat  →  groq/hardening (optional)
```

### Dependencies

- **Branch 0** blocks nothing; unblocks 1 and 2.
- **Branch 1** needs frozen trend shape from Person A (or seed `trends.json`).
- **Branch 2** needs Branch 0 only (reads curated data, not rewritten brief).
- **Branch 3** is post-demo polish — skip if time is tight.

Person C can build the full UI against static JSON before any Groq branch lands.

---

## Branch 0: `feature/groq-client` — complete

**Goal:** Shared Groq primitive. No product-facing routes yet.  
**Merged:** PR #1

**Files:**
- `lib/groq.js` — `hasGroqKey()`, `groqChat({ system, user, temperature })`
- `.env.example` — `GROQ_API_KEY`, `GROQ_MODEL`

**Merge criteria:**
- [x] Valid key → Groq returns text
- [x] Missing key → clear error
- [x] No new npm dependencies

**Detail plan:** [groq-client.md](branches/groq-client.md)

---

## Branch 1: `feature/groq-brief-rewrite` — complete

**Goal:** Daily brief with optional LLM-polished summaries.  
**Merged:** PR #2

**Files:**
- `lib/brief.js` — `getBrief()`, rewrite prompt, daily in-memory cache
- `app/api/brief/route.js` — thin `GET` handler

**LLM contract:**

| Input | Output |
|-------|--------|
| `[{ id, metric, metricLabel, summary }]` | `[{ id, summary }]` only |

**Fallbacks (in order):**
1. No API key → curated summaries
2. Parse error or Groq failure → all curated summaries
3. Missing `id` in rewrite → that trend's curated summary

**Response shape:**
```json
{
  "date": "YYYY-MM-DD",
  "trends": [ "...trend objects..." ],
  "contrast": { "...unchanged..." },
  "rewritten": true
}
```

**Merge criteria:**
- [x] `GET /api/brief` works with and without `GROQ_API_KEY`
- [x] Spot-check: rewritten summaries contain no new numbers vs input
- [x] Second request same day uses cache (one Groq call per day per instance)

**Out of scope:** LLM-generated contrast headlines, live news, streaming.

**Detail plan:** [groq-brief-rewrite.md](branches/groq-brief-rewrite.md)

---

## Branch 2: `feature/groq-chat` — complete (local; push PR next)

**Goal:** Grounded Q&A over the sourced dataset.  
**Commit:** `cde1f25` on `feature/groq-chat` (rebased onto main after PR #3)

**Files:**
- `app/api/chat/route.js`

**Request / response:**
```json
// POST body
{ "message": "What's improving in energy?" }

// Success
{ "reply": "..." }

// No key (still 200)
{ "reply": "The chat needs a Groq API key..." }
```

**v1 limits (intentional):**
- Single-turn — server sends only the current message, not UI chat history
- No streaming
- No RAG — full dataset fits in context (~5 trends)

**Merge criteria:**
- [x] On-topic question cites real figures and source names
- [x] Off-topic question refuses politely
- [x] Works when brief rewrite is disabled / failing

**Detail plan:** [groq-chat.md](branches/groq-chat.md)

---

## Branch 3: chat history — in progress locally

**Branch:** `feature/groq-chat-history`  
**Why:** Single-turn chat fails on follow-ups like "tell me more" after a specific topic.

**Ships:**
- `lib/groq.js` — optional `history[]` alongside `user`
- `app/api/chat/route.js` — accepts `history`, caps at last 6 turns
- `components/ChatBox.js` — sends prior turns with each POST

**Still skip (not needed):** structured output, contrast rewrite, ELI5, streaming, Groq SDK.

**Detail plan:** [groq-hardening.md](branches/groq-hardening.md)

---

## Team contracts

### With Person A (data)

Freeze trend object shape before Branch 1:

```json
{
  "id": "string",
  "topic": "string",
  "title": "string",
  "metric": "string",
  "metricLabel": "string",
  "summary": "string",
  "source": { "name": "string", "url": "string" }
}
```

Person B reads data only through `lib/data.js` (`getTrends()`, `getContrast()`).
Live API feeds plug in there — Groq code does not change.

### With Person C (frontend)

| Endpoint | Method | Response |
|----------|--------|----------|
| `/api/brief` | `GET` | `{ date, trends[], contrast, rewritten }` |
| `/api/chat` | `POST` | `{ reply }` or `{ error }` |

Frontend branches can wire against static JSON before Groq branches merge.

---

## File map (current)

```
lib/
  groq.js       ← Branch 0
  brief.js      ← Branch 1
  data.js       ← Person A seam (not Groq)
app/api/
  brief/route.js  ← Branch 1
  chat/route.js   ← Branch 2
.env.example    ← Branch 0
```

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| LLM invents numbers | Strict prompt; rewrite `summary` only; curated fallback |
| Groq rate limits / downtime | Daily cache; static fallback dataset |
| JSON parse failures | Strip markdown fences; per-item fallback; optional Branch 3 schema |
| Scope creep on chat | Single-turn, no streaming, ship after brief |

---

## PR checklist (every branch)

- [ ] Works without `GROQ_API_KEY` where applicable
- [ ] No unrelated frontend changes
- [ ] Manual test notes in PR description
- [ ] Env changes documented in `.env.example` (Branch 0 only)

---

## Branch detail plans

| Branch | Status | Doc |
|--------|--------|-----|
| `feature/groq-client` | Complete (PR #1) | [groq-client.md](branches/groq-client.md) |
| `feature/groq-brief-rewrite` | Complete (PR #2) | [groq-brief-rewrite.md](branches/groq-brief-rewrite.md) |
| `feature/groq-chat` | Complete (PR #5) | [groq-chat.md](branches/groq-chat.md) |
| `feature/groq-chat-history` | Done locally — push/PR when ready | [groq-hardening.md](branches/groq-hardening.md) |

Required Groq branches 0–2 are merged. Chat history is the last AI change.
