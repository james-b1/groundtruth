# Branch: `feature/groq-chat`

**Parent:** [GROQ_PLAN.md](../GROQ_PLAN.md) · **Order:** 2 of 3 (required)  
**Status:** Complete locally (`cde1f25`) — push/PR, then merge  
**Depends on:** `feature/groq-client` only (uses curated data via `lib/data.js`)

Grounded chat endpoint. Answers questions strictly from the sourced dataset.

---

## Scope

- `app/api/chat/route.js` — `POST` handler + system prompt builder

## Out of scope

- Multi-turn history sent to Groq (UI may show history; server is single-turn)
- Streaming responses
- Frontend `ChatBox` (Person C wires separately)
- Brief rewrite logic

---

## Implementation

### `POST /api/chat`

**Request:**
```json
{ "message": "What's improving in energy?" }
```

**Validation:**
- Invalid JSON → 400 `{ "error": "Invalid request body." }`
- Missing/non-string `message` → 400 `{ "error": "Please include a \`message\` string." }`

**No API key:** 200 with helpful `reply` (not an error) pointing to `.env.example`

**Success:** 200 `{ "reply": "..." }`  
**Groq failure:** 500 `{ "error": "The chat is temporarily unavailable." }`

### System prompt

Build from `getTrends()` + `getContrast()` via `lib/data.js`.

Include in context per trend: `topic`, `title`, `metric`, `metricLabel`, `summary`, `source`  
Include full `contrast` object.

**Rules in prompt:**
- Answer only from injected data
- Never invent numbers or sources
- Warm, concise, jargon-free
- Cite source name when quoting a figure
- If answer isn't in data, say so and mention what the brief covers

**User message:** the raw `message` from the request  
**Temperature:** `0.3`

### `export const dynamic = "force-dynamic"`

---

## Manual test

**Without key:**

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What about energy?"}'
```

- [ ] 200, reply explains key is needed

**With key — on topic:**

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is improving in clean energy?"}'
```

- [ ] Mentions solar / renewable figures from dataset
- [ ] References a source name (e.g. Our World in Data)

**With key — off topic:**

```bash
-d '{"message":"What is the S&P 500 doing today?"}'
```

- [ ] Politely declines or says data doesn't cover that

**Bad request:**

```bash
-d '{}'
```

- [ ] 400

---

## Merge checklist

- [x] Reads data only through `lib/data.js`
- [x] No key → friendly reply, not 500
- [ ] On-topic / off-topic behavior verified manually (needs `GROQ_API_KEY` + `npm run dev`)
- [x] No frontend files in this PR

---

## PR description template

```
## What
POST /api/chat — grounded Q&A over trends.json.

## Test
- No key: helpful message
- "What's improving in energy?": cites solar trend + source
- Off-topic: polite refusal
```
