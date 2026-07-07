import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Local, on-disk cache written by the daily refresh. Because this project stays
// local (no serverless read-only filesystem to worry about), a plain JSON file
// next to the curated data is all we need.
export const CACHE_PATH = join(process.cwd(), "data", "trends.cache.json");

export function readCache() {
  try {
    if (!existsSync(CACHE_PATH)) return null;
    return JSON.parse(readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return null; // a corrupt cache should never break the brief
  }
}

export function writeCache(data) {
  writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2) + "\n");
  return CACHE_PATH;
}
