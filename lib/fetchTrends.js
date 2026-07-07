import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fetchOwidSeries } from "./sources/owid.js";
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

  return { asOf, trends, contrast: curated.contrast, errors };
}
