/**
 * Merges live figures from a source into a curated trend, producing the
 * common shape the frontend and chat consume. The `live` config block is
 * dropped from the output — it's an internal detail.
 *
 * Only the numbers (metric, metricLabel, and the raw value fields) come from
 * live data; the curated title, topic, and summary prose are preserved.
 */
export function normalizeTrend(trend, series) {
  const cfg = trend.live;
  const { live, ...rest } = trend;

  const fmt = (v) => `${(v * (cfg.scale ?? 1)).toFixed(cfg.decimals ?? 0)}${cfg.unit ?? ""}`;
  const direction = series.latest.value <= series.baseline.value ? "down" : "up";

  return {
    ...rest,
    metric: fmt(series.latest.value),
    metricLabel: `${cfg.label}, ${direction} from ${fmt(series.baseline.value)} in ${series.baseline.year}`,
    direction,
    value: series.latest.value,
    valueYear: series.latest.year,
    baselineValue: series.baseline.value,
    baselineYear: series.baseline.year,
    source: { ...trend.source, url: series.sourceUrl || trend.source.url },
    live: true,
  };
}

/** Strips the internal `live` config for trends served straight from curation. */
export function stripLiveConfig(trend) {
  const { live, ...rest } = trend;
  return { ...rest, live: false };
}
