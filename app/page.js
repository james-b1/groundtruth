"use client";

import { useEffect, useState } from "react";
import TrendCard from "@/components/TrendCard";
import ContrastBlock from "@/components/ContrastBlock";
import ChatBox from "@/components/ChatBox";

function formatDate(iso) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatAsOf(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

export default function Home() {
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/brief")
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then(setBrief)
      .catch(() => setError("Could not load today's brief. Try refreshing."));
  }, []);

  return (
    <main className="wrap">
      <header className="masthead">
        <h1>Groundtruth</h1>
        <p className="date">{brief ? formatDate(brief.date) : "Today's brief"}</p>
        <p className="tagline">Five honest, sourced minutes on what's actually going right.</p>
        {brief?.asOf ? (
          <p className="as-of">Live data refreshed {formatAsOf(brief.asOf)}</p>
        ) : brief ? (
          <p className="as-of">Using curated figures (run npm run refresh for live data)</p>
        ) : null}
      </header>

      {error && <div className="state">{error}</div>}
      {!brief && !error && <div className="state">Loading today's brief…</div>}

      {brief && (
        <>
          <div className="section-label">What's getting better</div>
          {brief.trends.map((t) => (
            <TrendCard key={t.id} trend={t} />
          ))}

          <div className="section-label">Today vs. the trend</div>
          <ContrastBlock contrast={brief.contrast} />

          <ChatBox />

          <footer>
            Every claim links to its source. Live cards pull the latest OWID figures when
            available; curated cards use hand-checked fallbacks. The AI only rewrites
            tone, never invents figures.
          </footer>
        </>
      )}
    </main>
  );
}
