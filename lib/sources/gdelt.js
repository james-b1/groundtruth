const BASE = "https://api.gdeltproject.org/api/v2/doc/doc";

/**
 * Fetches the most recent real news headline matching a query, for the
 * "today's headline" side of the contrast. GDELT is keyless and covers global
 * news, which suits a local demo.
 *
 * Returns a ready-to-render headline; the caller pairs it against the curated
 * long-term trend. Throws on any failure so the caller can fall back to the
 * curated headline — the contrast is never left empty.
 *
 * @param {{query:string, timespan?:string, maxrecords?:number}} cfg
 * @returns {Promise<{text:string, source:{name:string,url:string}, seenDate:string|null}>}
 */
export async function fetchGdeltHeadline({ query, timespan = "1w", maxrecords = 15 }) {
  const params = new URLSearchParams({
    query: `${query} sourcelang:english`,
    mode: "ArtList",
    maxrecords: String(maxrecords),
    format: "json",
    sortby: "DateDesc",
    timespan,
  });

  const res = await fetch(`${BASE}?${params}`, {
    headers: { "User-Agent": "Groundtruth/0.1 (local demo)" },
  });
  if (!res.ok) throw new Error(`GDELT → HTTP ${res.status}`);

  // GDELT returns an HTML error page (not JSON) on bad queries / rate limits.
  const body = await res.text();
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error("GDELT → non-JSON response");
  }

  const articles = data.articles || [];
  const article = articles.find((a) => a.language === "English" && a.title) || articles[0];
  if (!article?.title) throw new Error(`GDELT → no articles for "${query}"`);

  return {
    text: `"${cleanTitle(article.title)}"`,
    source: { name: article.domain || "GDELT", url: article.url },
    seenDate: formatSeenDate(article.seendate),
  };
}

// GDELT titles are tokenized ("2 , 104 cases"); tidy spacing around punctuation.
function cleanTitle(title) {
  return title
    .replace(/\s+([,.;:!?%])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// "20260622T170000Z" → "Jun 22, 2026"
function formatSeenDate(seendate) {
  if (!seendate || seendate.length < 8) return null;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mi = parseInt(seendate.slice(4, 6), 10) - 1;
  if (mi < 0 || mi > 11) return null;
  return `${months[mi]} ${parseInt(seendate.slice(6, 8), 10)}, ${seendate.slice(0, 4)}`;
}
