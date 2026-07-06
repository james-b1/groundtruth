const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export function hasGroqKey() {
  return Boolean(process.env.GROQ_API_KEY);
}

/**
 * Minimal Groq chat-completion wrapper (Groq is OpenAI-compatible, so this is
 * just a fetch — no SDK dependency needed).
 *
 * @param {{system?: string, user: string, temperature?: number}} opts
 * @returns {Promise<string>} the assistant's reply text
 */
export async function groqChat({ system, user, temperature = 0.3 }) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set");

  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: user });

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      messages,
      temperature,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Groq request failed (${res.status}): ${detail}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
