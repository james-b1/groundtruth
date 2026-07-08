import { getContrast, getDataAsOf, getTrends } from "@/lib/data";
import { groqChat, hasGroqKey } from "@/lib/groq";

// One Groq call per day on the first request.
let cache = { date: null, brief: null };

function today() {
  return new Date().toISOString().slice(0, 10);
}

const REWRITE_SYSTEM = `You edit summaries for Groundtruth, a daily brief on measured global improvements.

You get a JSON array of trend items. For each item, rewrite ONLY "summary" into two plain sentences. No jargon.

Rules:
- Do not add, remove, or change any number, percentage, year, or named fact. Use only figures in the input.
- Do not invent sources or claims.
- Keep the same meaning. Change tone and clarity only.

Respond with ONLY a JSON array like [{"id": "...", "summary": "..."}]. No prose, no markdown.`;

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
    asOf: getDataAsOf(), // when the live data was last refreshed (null = static)
  };

  cache = { date: today(), brief };
  return brief;
}
