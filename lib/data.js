import staticData from "@/data/trends.json";
import { stripLiveConfig } from "@/lib/normalizeTrends";
import { readCache } from "@/lib/trendsCache";

// Prefer the live cache written by `npm run refresh`; fall back to the curated
// static dataset so the app is fully functional before the first refresh (and
// if every source fails). This is the seam the PRD calls out for its "cached
// static fallback" mitigation.
function curatedTrends() {
  return staticData.trends.map(stripLiveConfig);
}

export function getTrends() {
  const cached = readCache();
  return cached?.trends?.length ? cached.trends : curatedTrends();
}

export function getContrast() {
  const cached = readCache();
  return cached?.contrast ?? staticData.contrast;
}

// ISO timestamp of the last successful refresh, or null if serving static data.
export function getDataAsOf() {
  return readCache()?.asOf ?? null;
}
