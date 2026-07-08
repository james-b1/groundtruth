"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const exampleQuestions = [
  "Is global hunger actually increasing?",
  "How much has extreme poverty changed since 2000?",
  "What's improving in clean energy?",
  "How is access to clean water improving?",
];

export default function AskAboutData() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSend(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const history = messages.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Something went wrong.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Could not reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="ask" className="max-w-2xl mx-auto px-6 py-16 border-t border-line">
      <Reveal>
        <h2 className="font-serif text-3xl text-ink mb-2">Ask about the data</h2>
        <p className="text-sm text-ink-soft mb-8">
          Questions answered from today&rsquo;s sourced dataset only.
        </p>
      </Reveal>

      <Reveal delay={60}>
        <div className="border border-line bg-white panel-hover">
          {messages.length > 0 && (
            <div className="divide-y divide-line max-h-80 overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message-in p-4 text-sm leading-relaxed ${
                    msg.role === "assistant" ? "bg-paper" : ""
                  }`}
                >
                  <p className="text-[0.65rem] uppercase tracking-wider font-medium mb-1 text-muted">
                    {msg.role === "user" ? "You" : "From the brief"}
                  </p>
                  <p className={msg.role === "assistant" ? "text-ink-soft" : "text-ink"}>
                    {msg.text}
                  </p>
                </div>
              ))}
              {loading && (
                <div className="p-4 bg-paper text-sm text-muted text-pulse">
                  Looking up the brief…
                </div>
              )}
            </div>
          )}

          <div className="p-4 border-t border-line flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
              placeholder="Ask about global progress…"
              aria-label="Ask a question about the data"
              className="flex-1 border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted transition-colors duration-200 focus:border-accent"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={loading}
              aria-label="Send question"
              className="btn-press bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent-deep disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {messages.length === 0 && (
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {exampleQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="text-xs text-ink-soft border border-line px-3 py-1.5 transition-colors duration-200 hover:border-accent hover:text-accent hover:bg-accent-soft/40"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-muted text-center mt-4">
          Answers use today&rsquo;s brief only. Sources cited when figures are given.
        </p>
      </Reveal>
    </section>
  );
}
