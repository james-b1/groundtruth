# Groundtruth

**A calm daily briefing on what's improving in the world, backed by real data.**

News is optimized for alarm. When disease rates, poverty, and clean-energy costs
improve, it's either unreported or buried. Groundtruth gives a normal person five
honest, sourced minutes on what's actually going right — every claim traces to a
real, checkable source, written in plain English you can read at breakfast.

It sits between unrigorous "positive news" apps (no sourcing) and rigorous data
tools like Our World in Data (trustworthy, but built for researchers).

---

## What it does

- **Daily brief** — 3–5 sourced trends (poverty, health, disease, clean energy,
  conservation), each with a headline metric and a plain-English takeaway.
- **Today vs. the trend** — one alarming-but-narrow current headline paired
  against the relevant long-term trend.
- **Ask about the data** — a small chat box grounded strictly in the sourced
  dataset ("What's improving in energy?"). It never invents numbers.
- **Sources on every claim** — each card links to the underlying data.
- **Clean, mobile-friendly UI** — no login, no clutter.

---

## Tech stack

| Piece      | Choice                                                              |
| ---------- | ------------------------------------------------------------------ |
| Framework  | Next.js (App Router) — React frontend + API routes in one codebase |
| LLM        | Groq API (`llama-3.3-70b-versatile`) via a tiny `fetch` wrapper     |
| Data       | Curated, hand-verified JSON (`data/trends.json`)                    |
| Endpoints  | `GET /api/brief`, `POST /api/chat`                                  |
| Hosting    | Runs locally; deploys to Vercel free tier                          |

The LLM **only rewrites tone** — a strict system prompt forbids adding or
changing any figure. If Groq is unavailable (or no key is set), the app falls
back to the curated summaries, so it's always functional.

---

## Getting started

```bash
# 1. Install
npm install

# 2. (Optional but recommended) add a Groq key for LLM rewrites + chat
cp .env.example .env
# then paste your key from https://console.groq.com/keys into GROQ_API_KEY

# 3. Run
npm run dev
```

Open <http://localhost:3000>.

> **No API key?** The brief still renders using the curated summaries; only the
> AI rewrite and the chat box need `GROQ_API_KEY`.

---

## Project structure

```
groundtruth/
├── app/
│   ├── page.js              # Home — fetches /api/brief, renders the brief
│   ├── layout.js
│   ├── globals.css
│   └── api/
│       ├── brief/route.js   # GET  — builds today's brief (cached 1×/day)
│       └── chat/route.js    # POST — grounded chat over the dataset
├── components/
│   ├── TrendCard.js
│   ├── ContrastBlock.js
│   └── ChatBox.js
├── lib/
│   ├── data.js              # reads the dataset (seam for a live source later)
│   ├── groq.js              # minimal Groq (OpenAI-compatible) client
│   └── brief.js             # brief assembly + LLM rewrite + daily cache
└── data/
    └── trends.json          # curated, sourced trends + contrast block
```

---

## Editing the brief

Everything shown comes from [`data/trends.json`](data/trends.json). To refresh
the brief, edit the `trends` array and the `contrast` block — keep a real
`source.url` on every entry. The LLM rewrites tone only; it uses the figures
exactly as written here.

### Going live later (out of scope for v1)

`lib/data.js` is the single seam where live sources would plug in:

- **Our World in Data / WHO** — poverty, disease, health, energy trends
- **NewsAPI / GDELT** — the "today's headline" side of the contrast
- **IEA / IRENA** — renewable-energy stats

A daily cron (or Vercel Cron) would refresh the dataset 1×/day. Until then, the
curated static dataset keeps demos reliable and rate-limit-free.

---

## Scope (from the PRD)

**In:** daily brief, today-vs-trend contrast, grounded chat, sources, clean
mobile UI.

**Out (v1):** user accounts/login, live maps or real-time layers, native mobile
app, localization/multi-language, email newsletter.
