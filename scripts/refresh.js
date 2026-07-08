// Refreshes the trend cache from live sources. Run manually with
// `npm run refresh`, or on a schedule (e.g. a cron entry or node-cron wrapper):
//   0 6 * * *  cd /path/to/groundtruth && npm run refresh
import { refreshTrends } from "../lib/refreshTrends.js";
import { CACHE_PATH } from "../lib/trendsCache.js";

const result = await refreshTrends();

const live = result.trends.filter((t) => t.live);
console.log(`Refreshed ${result.trends.length} trends (${live.length} live) → ${CACHE_PATH}`);
for (const t of live) {
  console.log(`  • ${t.id}: ${t.metric} (${t.metricLabel})`);
}
if (result.errors.length) {
  console.warn(`\n${result.errors.length} source error(s), used curated fallback:`);
  for (const e of result.errors) console.warn(`  ! ${e}`);
}
