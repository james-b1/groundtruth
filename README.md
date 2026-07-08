# Groundtruth

Daily briefing on trends that are improving, with sources you can check.

News favors alarm. Gains in poverty, disease, and clean energy often get skipped or buried. Groundtruth shows a short set of sourced trends and one current headline set against the longer pattern.

## Features

- **Daily brief** — 3–5 trends (poverty, health, disease, clean energy, conservation) with a headline metric and a short takeaway
- **Today vs. the trend** — one current headline next to the long-term number
- **Chat** — ask about the brief data only; answers stay inside that dataset
- **Sources** — every claim links out
- **Web UI** — no login

## Stack

| Piece | Choice |
| ----- | ------ |
| Framework | Next.js (App Router) |
| LLM | Groq (`llama-3.3-70b-versatile`) via `fetch` |
| Data | `data/trends.json` plus optional OWID refresh cache |
| Endpoints | `GET /api/brief`, `POST /api/chat`, `POST /api/refresh` |
| Hosting | Local; Vercel free tier if needed |

Groq rewrites tone only. Missing or failed keys fall back to curated summaries.

## Getting started

```bash
npm install
cp .env.example .env
# optional: set GROQ_API_KEY from https://console.groq.com/keys
npm run refresh   # optional: pull live OWID figures into the cache
npm run dev
```

Open <http://localhost:3000>.

Without `GROQ_API_KEY`, the brief still loads from curated or cached figures. Chat and LLM rewrites need the key.

## Project structure

```
groundtruth/
├── app/
│   ├── page.js
│   ├── layout.js
│   ├── globals.css
│   └── api/
│       ├── brief/route.js
│       ├── chat/route.js
│       └── refresh/route.js
├── components/
│   ├── TrendCard.js
│   ├── ContrastBlock.js
│   └── ChatBox.js
├── lib/
│   ├── data.js
│   ├── groq.js
│   ├── brief.js
│   ├── fetchTrends.js
│   ├── normalizeTrends.js
│   ├── refreshTrends.js
│   ├── trendsCache.js
│   └── sources/
│       └── owid.js
├── scripts/
│   └── refresh.js
└── data/
    ├── trends.json
    └── trends.cache.json   # gitignored; from npm run refresh
```

## Data pipeline

```
npm run refresh            OWID CSV → normalize → data/trends.cache.json
        │
   POST /api/refresh ──────┘
                                                       ▼
GET /api/brief ──► lib/data.js: cache if present, else trends.json
```

- Trends with a `live` block in [`data/trends.json`](data/trends.json) refresh from OWID. `npm run refresh` writes `trends.cache.json` and sets `asOf`.
- Trends without `live` stay static. Failed fetches for a live trend keep that card's curated figures.
- Cron example: `0 6 * * * cd /path/to/groundtruth && npm run refresh`.

### Add a live trend

1. Add curated `metric` / `summary` / `source` in `trends.json` (fallback).
2. Add `live`: `{ source, slug, entity, baselineYear, scale, decimals, unit, label }`.
3. Run `npm run refresh` and check the printed metric.

### Add a source besides OWID

Add a fetcher under `lib/sources/` that returns `{ latest:{year,value}, baseline:{year,value}, sourceUrl }`, then register it in `SOURCES` in [`lib/fetchTrends.js`](lib/fetchTrends.js).

## Scope

**In:** daily brief, today-vs-trend, grounded chat, sources, mobile-friendly web UI.

**Out (v1):** accounts, live maps, native app, i18n, email newsletter.
