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
            Every claim links to its source. Numbers are curated and verified; the AI only
            rewrites them into plain English — it never invents figures.
          </footer>
        </>
      )}
    </main>
  );
}
