"use client";
import { useState } from "react";
import { Send, ChevronRight } from "lucide-react";
import { GlobeVisualization } from "./GlobeVisualization";

const chips = ["What good happened today?", "Show me health trends", "Is poverty rising?"];

const mockAnswer =
  "Based on World Bank data, extreme poverty has fallen from 36% of the global population in 1990 to under 9% today — lifting over 1.3 billion people out of deprivation, even as the world's population grew by 2.5 billion.";

export function HeroSection() {
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  function ask(q) {
    const query = q ?? input;
    if (!query.trim()) return;
    setInput("");
    setAnswer("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnswer(mockAnswer);
    }, 1100);
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #080D1A 0%, #0B1525 55%, #06101E 100%)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-16 grid grid-cols-[1fr_1fr] gap-8 items-center min-h-[580px]">
        
        {/* Left — text */}
        <div className="z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.38)",
              }}
            >
              Today's Brief — {today}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "3.25rem",
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
              color: "#FFFFFF",
            }}
          >
            The world is more
            <br />
            than today's
            <br />
            <span style={{ color: "#34D399" }}>headlines.</span>
          </h1>

          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "1rem",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.75,
              marginTop: "1.5rem",
              maxWidth: "28rem",
            }}
          >
            We surface long-term global progress using verified data — so you stay informed without the overwhelm.
          </p>

          <div className="flex items-center gap-3 mt-8">
            <a
              href="#trends"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "0.875rem" }}
              className="px-5 py-2.5 rounded-full bg-emerald-400 text-[#080D1A] hover:bg-emerald-300 transition-colors"
            >
              Read today's brief
            </a>
            <a
              href="#"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.35)",
              }}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              How it works <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right — globe + ask */}
        <div className="relative flex flex-col items-center">
          
          {/* Globe */}
          <div className="w-[420px] h-[420px] mx-auto">
            <GlobeVisualization />
          </div>

          {/* Ask interface */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[380px] rounded-2xl border border-white/10 p-4"
            style={{ background: "rgba(8,13,26,0.78)", backdropFilter: "blur(16px)" }}
          >
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "0.625rem",
              }}
            >
              Ask about today's trends
            </p>

            <div className="flex items-center gap-2 bg-white/6 border border-white/8 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-400/40 transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="What's improving in the world?"
                className="placeholder:text-white/25"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.8125rem",
                  color: "#FFFFFF",
                  background: "transparent",
                  outline: "none",
                  border: "none",
                  width: "100%",
                }}
              />
              <button
                onClick={() => ask()}
                className="w-6 h-6 rounded-lg bg-emerald-400 flex items-center justify-center hover:bg-emerald-300 transition-colors flex-shrink-0"
              >
                <Send className="w-2.5 h-2.5 text-[#080D1A]" />
              </button>
            </div>

            {!answer && !loading && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => ask(c)}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.6875rem",
                      color: "rgba(255,255,255,0.4)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                    }}
                    className="hover:text-emerald-300 hover:border-emerald-400/30 transition-colors"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {(loading || answer) && (
              <div className="mt-3 pt-3 border-t border-white/6">
                {loading ? (
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-emerald-400/60 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.6)",
                      lineHeight: 1.65,
                    }}
                  >
                    {answer}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
