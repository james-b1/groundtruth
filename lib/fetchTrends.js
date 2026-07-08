import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fetchOwidSeries } from "./sources/owid.js";
import { fetchGdeltHeadline } from "./sources/gdelt.js";
import { normalizeTrend, stripLiveConfig } from "./normalizeTrends.js";

// Registry of source fetchers. Add new upstreams (e.g. worldbank, gdelt) here.
const SOURCES = {
  owid: fetchOwidSeries,
};

function loadCurated() {
  const path = join(process.cwd(), "data", "trends.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

/**
 * Builds the full trend list from live sources, falling back to the curated
 * figures per-trend on any error. Never throws — a bad upstream degrades one
 * card, it doesn't take down the brief.
 *
 * @param {{asOf:string}} opts ISO timestamp to stamp the result with.
 */
export async function fetchTrends({ asOf }) {
  const curated = loadCurated();
  const trends = [];
  const errors = [];

  for (const trend of curated.trends) {
    if (!trend.live) {
      trends.push(stripLiveConfig(trend));
      continue;
    }
    const fetcher = SOURCES[trend.live.source];
    if (!fetcher) {
      errors.push(`${trend.id}: unknown source "${trend.live.source}"`);
      trends.push(stripLiveConfig(trend));
      continue;
    }
    try {
      const series = await fetcher(trend.live);
      trends.push(normalizeTrend(trend, series));
    } catch (err) {
      errors.push(`${trend.id}: ${err.message}`);
      trends.push(stripLiveConfig(trend)); // keep the verified fallback figures
    }
  }

  const contrast = await buildContrast(curated.contrast, errors);

  return { asOf, trends, contrast, errors };
}

/**
 * Replaces the contrast's "today's headline" with a live one from GDELT (when
 * the headline has a `query`), keeping the curated long-term trend beside it.
 * Falls back to the curated headline on any error.
 */
async function buildContrast(contrast, errors) {
  const query = contrast?.headline?.query;
  if (!query) return stripQuery(contrast);

  try {
    const live = await fetchGdeltHeadline({ query });
    return {
      ...contrast,
      headline: {
        text: live.text,
        note: contrast.headline.note,
        source: live.source,
        seenDate: live.seenDate,
      },
    };
  } catch (err) {
    errors.push(`contrast: ${err.message}`);
    return stripQuery(contrast); // keep the curated headline
  }
}

function stripQuery(contrast) {
  if (!contrast?.headline) return contrast;
  const { query, ...headline } = contrast.headline;
  return { ...contrast, headline };
}
