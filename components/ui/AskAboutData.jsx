"use client";

import { useState } from "react";
import { Send, Sparkles, ChevronRight } from "lucide-react";

const exampleQuestions = [
  "Is global hunger actually increasing?",
  "How much has extreme poverty changed since 2000?",
  "What's the real trend in violent crime globally?",
  "Are we losing more forests than we're gaining?",
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
    <section style={{ backgroundColor: "#F8FAFB" }} className="py-20">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="max-w-3xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  color: "#7C3AED",
                }}
              >
                AI-powered · Grounded in verified datasets
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1.875rem",
                letterSpacing: "-0.025em",
                color: "#111827",
              }}
              className="mb-2"
            >
              Ask about the data
            </h2>

            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "0.9375rem",
                color: "#6B7280",
              }}
            >
              Ask any question about global trends. Responses cite real sources — no opinions, no speculation.
            </p>
          </div>

          {/* Chat container */}
          <div
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            {/* Messages */}
            {messages.length > 0 && (
              <div className="p-6 space-y-5 max-h-80 overflow-y-auto border-b border-gray-50">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                      </div>
                    )}

                    <div
                      className="max-w-[80%] px-4 py-3 rounded-2xl"
                      style={{
                        backgroundColor:
                          msg.role === "user" ? "#111827" : "#F9FAFB",
                        borderRadius:
                          msg.role === "user"
                            ? "1rem 1rem 0.25rem 1rem"
                            : "0.25rem 1rem 1rem 1rem",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontSize: "0.875rem",
                          color:
                            msg.role === "user" ? "#FFFFFF" : "#374151",
                          lineHeight: 1.6,
                        }}
                      >
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                    </div>

                    <div className="px-4 py-3 rounded-2xl bg-gray-50">
                      <div className="flex gap-1 items-center h-5">
                        {[0, 1, 2].map((dot) => (
                          <div
                            key={dot}
                            className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: `${dot * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input area */}
            <div className="p-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus-within:border-violet-300 focus-within:bg-white transition-colors">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
                  placeholder="Ask a question about global progress data..."
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.9375rem",
                    color: "#111827",
                    background: "transparent",
                    outline: "none",
                    border: "none",
                    width: "100%",
                  }}
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Example questions */}
            {messages.length === 0 && (
              <div className="px-4 pb-5 space-y-2">
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    color: "#9CA3AF",
                    paddingLeft: "0.25rem",
                  }}
                >
                  Try asking:
                </p>

                <div className="flex flex-wrap gap-2">
                  {exampleQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: "0.8125rem",
                        color: "#4B5563",
                        backgroundColor: "#F3F4F6",
                        border: "1px solid #E5E7EB",
                        padding: "0.375rem 0.75rem",
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      className="hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50"
                    >
                      {q}
                      <ChevronRight className="w-3 h-3 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "0.8125rem",
              color: "#9CA3AF",
              textAlign: "center",
            }}
            className="mt-4"
          >
            Responses are generated by AI and grounded in public datasets from WHO, World Bank, IEA, FAO, and UN agencies.
          </p>
        </div>
      </div>
    </section>
  );
}
