import trendsData from "@/data/trends.json";

/**
 * Returns the curated trends + contrast block.
 *
 * This is the single seam where a live data source (Our World in Data API,
 * WHO datasets, GDELT/NewsAPI for the contrast headline) would plug in later.
 * For now it reads the hand-verified static dataset so demos never depend on a
 * flaky upstream API — matching the PRD's "cached static fallback" mitigation.
 */
export function getTrends() {
  return trendsData.trends;
}

export function getContrast() {
  return trendsData.contrast;
}
