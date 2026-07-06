import { getContrast, getTrends } from "@/lib/data";
import { groqChat, hasGroqKey } from "@/lib/groq";

// One Groq call per day on the first request.
let cache = { date: null, brief: null };

function today() {
  return new Date().toISOString().slice(0, 10);
}

const REWRITE_SYSTEM = `You are the editor of "Groundtruth", a calm daily brief about real, measurable ways the world is improving.

You will be given a JSON array of factual trend items. For each item, rewrite ONLY the "summary" field into two warm, plain-English sentences a tired person can read at breakfast. No jargon.

HARD RULES:
- Never add, remove, or change any number, percentage, year, or named fact. Use only figures present in the input.
- Never invent sources or claims.
- Keep the same meaning; only improve tone and clarity.

Respond with ONLY a JSON array of objects like [{"id": "...", "summary": "..."}] — no prose, no markdown.`;

/** Sends summaries to Groq and merges the rewrites back into the trend list. */
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

  const cleaned = reply.replace(/```json/gi, "").replace(/```/g, "").trim();
  const rewrites = JSON.parse(cleaned);
  const byId = new Map(rewrites.map((r) => [r.id, r.summary]));

  return trends.map((t) => ({
    ...t,
    summary: byId.get(t.id) || t.summary,
  }));
}

/** Returns today's brief: trends, contrast block, and rewritten flag. */
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
