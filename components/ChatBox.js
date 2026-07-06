"use client";

import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      const text = data.reply || data.error || "Something went wrong.";
      setMessages((m) => [...m, { role: "bot", text }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Could not reach the server." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chat">
      <h3>Ask about the data</h3>
      {messages.length > 0 && (
        <div className="log">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="msg bot">Thinking…</div>}
        </div>
      )}
      <form onSubmit={send}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. What's improving in energy?"
          aria-label="Ask a question about the data"
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Ask
        </button>
      </form>
      <p className="hint">Answers come only from today's sourced data — no made-up numbers.</p>
    </section>
  );
}
