# Branch: `feature/groq-client`

**Parent:** [GROQ_PLAN.md](../GROQ_PLAN.md) · **Order:** 0 of 3 (required)  
**Status:** Complete — merged in PR #1 (`182a104`)

Shared Groq client. No routes, no prompts. Everything else builds on this.

---

## Scope

- `lib/groq.js` — `hasGroqKey()`, `groqChat()`
- `.env.example` — document `GROQ_API_KEY` and optional `GROQ_MODEL`

## Out of scope

- `/api/brief`, `/api/chat`
- Prompts, caching, data loading
- Groq SDK or new npm packages

---

## Implementation

### `lib/groq.js`

```js
// POST https://api.groq.com/openai/v1/chat/completions
// Headers: Authorization: Bearer <key>, Content-Type: application/json
// Body: { model, messages: [{role, content}], temperature }

export function hasGroqKey()  // Boolean(process.env.GROQ_API_KEY)
export async function groqChat({ system?, user, temperature = 0.3 })
  // → assistant message content string
  // → throws if no key or non-2xx response
```

**Defaults:**
- Model: `llama-3.3-70b-versatile` (overridable via `GROQ_MODEL`)
- Temperature: `0.3` (callers override per job)

### `.env.example`

```
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
```

Add a one-line comment: app runs without a key; LLM features need it.

---

## Manual test

1. Copy `.env.example` → `.env`, add key from https://console.groq.com/keys
2. Temporarily add a dev-only route or `node --eval` script that calls:

```js
await groqChat({ user: "Reply with exactly: ok" })
// expect: "ok" (or similar short reply)
```

3. Unset `GROQ_API_KEY` → `groqChat` throws `"GROQ_API_KEY is not set"`

---

## Merge checklist

- [x] `hasGroqKey()` and `groqChat()` exported from `lib/groq.js`
- [x] No new dependencies in `package.json`
- [x] `.env.example` updated
- [x] Manual test passes with a real key

---

## PR description template

```
## What
Minimal Groq client (fetch wrapper, no SDK).

## Test
- With GROQ_API_KEY: groqChat returns a reply
- Without key: throws clear error
```
