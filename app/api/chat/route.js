import { NextResponse } from "next/server";
import { getContrast, getTrends } from "@/lib/data";
import { groqChat, hasGroqKey } from "@/lib/groq";

export const dynamic = "force-dynamic";

const MAX_HISTORY = 6;

/** Builds the system prompt from curated trends and contrast data. */
function buildSystemPrompt() {
  const trends = getTrends();
  const contrast = getContrast();

  const context = {
    trends: trends.map((t) => ({
      topic: t.topic,
      title: t.title,
      metric: t.metric,
      metricLabel: t.metricLabel,
      summary: t.summary,
      source: t.source,
    })),
    contrast,
  };

  return `You are the chat for Groundtruth. Answer using ONLY the data below.

Rules:
- Stick to figures and facts in this data. If the answer is not here, say so and name what the brief covers.
- Do not invent numbers or sources.
- Keep replies short and plain.
- Cite the source name with any figure.
- Use prior turns for follow-ups like "tell me more", but stay inside this data.

DATA:
${JSON.stringify(context, null, 2)}`;
}

/** Keeps only valid user/assistant turns, capped to the last few. */
function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter(
      (turn) =>
        turn &&
        (turn.role === "user" || turn.role === "assistant") &&
        typeof turn.content === "string" &&
        turn.content.trim()
    )
    .map((turn) => ({ role: turn.role, content: turn.content.trim() }))
    .slice(-MAX_HISTORY);
}

/** Grounded chat over today's sourced dataset. Supports optional multi-turn history. */
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { message, history } = body ?? {};

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Please include a `message` string." }, { status: 400 });
  }

  if (!hasGroqKey()) {
    return NextResponse.json({
      reply:
        "The chat needs a Groq API key to run. Add GROQ_API_KEY to your .env file (see .env.example) and restart. In the meantime, scroll up. Today's brief still works without a key.",
    });
  }

  try {
    const reply = await groqChat({
      system: buildSystemPrompt(),
      user: message,
      history: sanitizeHistory(history),
      temperature: 0.3,
    });
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("POST /api/chat failed:", err);
    return NextResponse.json({ error: "The chat is temporarily unavailable." }, { status: 500 });
  }
}
