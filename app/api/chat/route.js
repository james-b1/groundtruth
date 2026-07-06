import { NextResponse } from "next/server";
import { getContrast, getTrends } from "@/lib/data";
import { groqChat, hasGroqKey } from "@/lib/groq";

export const dynamic = "force-dynamic";

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

  return `You are the chat assistant for "Groundtruth", a calm daily brief about real ways the world is improving.

Answer the user's question using ONLY the data below. Rules:
- Only use figures and facts present in this data. If the answer isn't here, say so plainly and suggest what the brief does cover.
- Never invent numbers or sources.
- Be warm, concise, and jargon-free.
- When you cite a figure, mention its source name.

DATA:
${JSON.stringify(context, null, 2)}`;
}

/** Grounded chat over today's sourced dataset. */
export async function POST(req) {
  let message;
  try {
    ({ message } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

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
      temperature: 0.3,
    });
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("POST /api/chat failed:", err);
    return NextResponse.json({ error: "The chat is temporarily unavailable." }, { status: 500 });
  }
}
