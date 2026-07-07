import { fetchTrends } from "./fetchTrends.js";
import { writeCache } from "./trendsCache.js";

/**
 * Runs the fetch → normalize pipeline and writes the result to the on-disk
 * cache. Shared by the CLI refresh script and the POST /api/refresh route.
 */
export async function refreshTrends() {
  const asOf = new Date().toISOString();
  const result = await fetchTrends({ asOf });
  writeCache(result);
  return result;
}
