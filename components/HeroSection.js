"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { GlobeVisualization } from "./GlobeVisualization";


const chips = [
  "What good happened today?",
  "Show me health trends",
  "Is poverty rising?",
];

const mockAnswer =
  "Based on World Bank data, extreme poverty has fallen from 36% of the global population in 1990 to under 9% today — lifting over 1.3 billion people out of deprivation, even as the world's population grew by 2.5 billion.";

export default function HeroSection() {
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
      style={{
        background:
          "linear-gradient(160deg, #080D1A 0%, #0B1525 55%, #06101E 100%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-20 grid grid-cols-[1fr_1fr] gap-12 items-center min-h-[620px]">
        
        {/* LEFT — TEXT */}
        <div className="z-10">
          {/* Date */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span
              className="text-[13px]"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                color: "rgba(255,255,255,0.38)",
              }}
            >
               {today}
            </span>
          </div>

          {/* Heading */}
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
            than today’s
            <br />
            <span style={{ color: "#34D399" }}>headlines.</span>
          </h1>

          {/* Subtext */}
          <p
            className="mt-6 max-w-[28rem]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "1rem",
              color: "rgba(255,255,255,0.45)",
              lineHeight: 1.75,
            }}
          >
            We show long‑term global progress using verified data so you
            stay informed without being overwhelmed.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-8">
            <a
              href="#trends"
              className="px-5 py-2.5 rounded-full bg-emerald-400 text-[#080D1A] hover:bg-emerald-300 transition-colors"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              Read today’s trends
            </a>
          </div>
        </div>

        {/* RIGHT — GLOBE + ASK BOX */}
        <div className="relative flex flex-col items-center">
          
          {/* Globe */}
          <div className="w-[420px] h-[420px] mx-auto">
            <GlobeVisualization />
          </div>

          {/* Ask Box */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[380px] rounded-2xl border border-white/10 p-4"
            style={{
              background: "rgba(8,13,26,0.78)",
              backdropFilter: "blur(16px)",
            }}
          >
            <p
              className="mb-2"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              Ask about today’s trends
            </p>

            {/* Input */}
            <div className="flex items-center gap-2 bg-white/6 border border-white/8 rounded-xl px-3.5 py-2.5 focus-within:border-emerald-400/40 transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="What’s improving in the world?"
                className="placeholder:text-white/25 w-full"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.8125rem",
                  color: "#ffffff",
                  background: "transparent",
                  outline: "none",
                  border: "none",
                }}
              />

              <button
                onClick={() => ask()}
                className="w-6 h-6 rounded-lg bg-emerald-400 flex items-center justify-center hover:bg-emerald-300 transition-colors flex-shrink-0"
              >
                <Send className="w-2.5 h-2.5 text-[#080D1A]" />
              </button>
            </div>

            {/* Chips */}
            {!answer && !loading && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {chips.map((c) => (
                  <button
                    key={c}
                    onClick={() => ask(c)}
                    className="hover:text-emerald-300 hover:border-emerald-400/30 transition-colors"
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
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {/* Answer */}
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
