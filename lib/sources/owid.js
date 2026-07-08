const BASE = "https://ourworldindata.org/grapher";

/**
 * Fetches one Our World in Data grapher series and returns the latest value and
 * a baseline value for computing the long-term change.
 *
 * OWID exposes every chart as CSV at `<slug>.csv` (no API key). The shape is:
 *   entity,code,year,<metric>[,...more columns]
 * We keep only rows for `entity` (default "World") and read the first data
 * column (index 3), which is the metric for every series we use.
 *
 * @param {{slug:string, entity?:string, baselineYear?:number, columnIndex?:number}} cfg
 * @returns {Promise<{latest:{year:number,value:number}, baseline:{year:number,value:number}, sourceUrl:string}>}
 */
export async function fetchOwidSeries({ slug, entity = "World", baselineYear, columnIndex = 3 }) {
  const url = `${BASE}/${slug}.csv?csvType=full&useColumnShortNames=true`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Groundtruth/0.1 (local demo)" },
  });
  if (!res.ok) throw new Error(`OWID "${slug}" → HTTP ${res.status}`);

  const rows = parseRows(await res.text(), entity, columnIndex);
  if (!rows.length) throw new Error(`OWID "${slug}" → no rows for entity "${entity}"`);

  return {
    latest: rows[rows.length - 1],
    baseline: pickBaseline(rows, baselineYear),
    sourceUrl: `${BASE}/${slug}`,
  };
}

function parseRows(csv, entity, columnIndex) {
  const lines = csv.trim().split("\n");
  const out = [];
  // Skip the header (line 0). World/entity names and numeric values contain no
  // commas, so a plain split is safe for the rows we keep.
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols[0] !== entity) continue;
    const year = parseInt(cols[2], 10);
    const value = parseFloat(cols[columnIndex]);
    if (Number.isFinite(year) && Number.isFinite(value)) out.push({ year, value });
  }
  out.sort((a, b) => a.year - b.year);
  return out;
}

// Earliest row at or after the requested baseline year (falls back to the
// earliest available row if the series starts later).
function pickBaseline(rows, baselineYear) {
  if (!baselineYear) return rows[0];
  const atOrAfter = rows.filter((r) => r.year >= baselineYear);
  return atOrAfter.length ? atOrAfter[0] : rows[0];
}
