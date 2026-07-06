import { getContrast, getTrends } from "@/lib/data";
import { groqChat, hasGroqKey } from "@/lib/groq";

// Simple in-memory cache so the brief is generated at most once per day.
// (For a single-instance deploy this is plenty; swap for a KV store if you
// scale to multiple instances.)
let cache = { date: null, brief: null };

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// Strict prompt: the LLM rewrites TONE only and must never touch the numbers.
// This is the core mitigation against the "LLM invents figures" risk.
const REWRITE_SYSTEM = `You are the editor of "Groundtruth", a calm daily brief about real, measurable ways the world is improving.

You will be given a JSON array of factual trend items. For each item, rewrite ONLY the "summary" field into two warm, plain-English sentences a tired person can read at breakfast. No jargon.

HARD RULES:
- Never add, remove, or change any number, percentage, year, or named fact. Use only figures present in the input.
- Never invent sources or claims.
- Keep the same meaning; only improve tone and clarity.

Respond with ONLY a JSON array of objects like [{"id": "...", "summary": "..."}] — no prose, no markdown.`;

async function rewriteSummaries(trends) {
  const payload = trends.map((t) => ({
    id: t.id,
    metric: t.metric,
    metricLabel: t.metricLabel,
    summary: t.summary,
  }));

  const reply = await groqChat({
    system: REWRITE_SYSTEM,
    user: JSON.stringify(payload),
    temperature: 0.4,
  });

  // Be defensive: strip any accidental markdown fencing before parsing.
  const cleaned = reply.replace(/```json/gi, "").replace(/```/g, "").trim();
  const rewrites = JSON.parse(cleaned);
  const byId = new Map(rewrites.map((r) => [r.id, r.summary]));

  return trends.map((t) => ({
    ...t,
    summary: byId.get(t.id) || t.summary, // fall back to curated text per-item
  }));
}

/**
 * Builds today's brief. Uses the LLM to rewrite tone when a key is present;
 * otherwise returns the curated summaries verbatim so the app is fully
 * functional with no API key.
 */
export async function getBrief() {
  if (cache.date === today() && cache.brief) {
    return cache.brief;
  }

  const rawTrends = getTrends();
  let trends = rawTrends;
  let rewritten = false;

  if (hasGroqKey()) {
    try {
      trends = await rewriteSummaries(rawTrends);
      rewritten = true;
    } catch (err) {
      // Never let an LLM hiccup take down the brief — fall back to curated text.
      console.error("Brief rewrite failed, using curated summaries:", err.message);
      trends = rawTrends;
    }
  }

  const brief = {
    date: today(),
    trends,
    contrast: getContrast(),
    rewritten,
  };

  cache = { date: today(), brief };
  return brief;
}
