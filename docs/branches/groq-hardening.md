# Branch: `feature/groq-hardening`

**Parent:** [GROQ_PLAN.md](../GROQ_PLAN.md) · **Order:** 3 (optional, post-demo)

Polish items only. **One sub-item per PR.** Skip entirely if the demo is stable.

---

## When to use this branch

Branches 0–2 are merged and demo-ready. You have spare time or hit a specific pain point.

| Sub-item | Pick when… |
|----------|------------|
| Structured output | Brief rewrite occasionally returns unparseable JSON |
| Chat history | Users expect "tell me more" follow-ups |
| Contrast rewrite | Contrast copy feels stiff but facts are correct |
| ELI5 toggle | PRD "could have" — simpler explanations on demand |

---

## Sub-item: Structured output

**Files:** `lib/groq.js` (add optional `responseFormat` param), `lib/brief.js`

Add Groq `response_format` with JSON schema for the rewrite array:

```json
{
  "type": "json_schema",
  "json_schema": {
    "name": "summary_rewrites",
    "strict": false,
    "schema": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "summary": { "type": "string" }
        },
        "required": ["id", "summary"]
      }
    }
  }
}
```

Keep existing parse fallback. `strict: true` only if you switch to a supported model.

**Test:** 10 consecutive brief loads parse without manual fence-stripping.

---

## Sub-item: Chat history

**Files:** `app/api/chat/route.js`, optionally `components/ChatBox.js`

**API change:**
```json
{ "message": "Tell me more", "history": [{ "role": "user", "content": "..." }, { "role": "assistant", "content": "..." }] }
```

Cap at last 4–6 turns. Still inject full dataset in system prompt.  
`history` optional — old clients keep working.

**Test:** Follow-up question references prior answer without re-asking context.

---

## Sub-item: Contrast rewrite

**Files:** `lib/brief.js`

Same rules as trend rewrite — tone only on `contrast.headline.text` and `contrast.trend.text`.  
Never rewrite source URLs or invent headline events.

**Test:** Numbers in contrast unchanged; sources still match `trends.json`.

---

## Sub-item: ELI5 toggle

**Files:** `lib/brief.js`, `app/api/brief/route.js`

`GET /api/brief?mode=eli5` swaps rewrite system prompt to shorter, simpler sentences.  
Default mode unchanged.

**Test:** ELI5 summaries are shorter; numbers still match input.

---

## Out of scope (even here)

- Streaming
- Groq SDK
- Multi-model routing
- Automated eval harness
- Live news in contrast

---

## Merge checklist (any sub-item)

- [ ] Single focused change
- [ ] Existing behavior unchanged when new option not used
- [ ] Manual test notes in PR
