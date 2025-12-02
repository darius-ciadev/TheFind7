// ------------------------------------------------------
// Search Engine v4 — Collections + Filters + Fuzzy Search
// ------------------------------------------------------

import { Item, items as ALL_ITEMS } from "@/data/items";
import { collectionsMap } from "@/data/getCollection";

// Helper: safe lowercase
const low = (v: any) =>
  v === undefined || v === null ? "" : String(v).toLowerCase();

// ------------------------------------------------------
// FUZZY: Levenshtein distance
// ------------------------------------------------------
function fuzzyDistance(a: string, b: string): number {
  if (!a || !b) return 999;
  if (a === b) return 0;

  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

// ------------------------------------------------------
// WEIGHTED SCORE
// ------------------------------------------------------
function computeScore(item: Item, q: string): number {
  const t = low(item.title);
  const c = low(item.category);
  const s = low(item.subtitle);
  const d = low(item.description);

  let score = 0;

  if (t.startsWith(q)) score += 60;
  if (t.includes(q)) score += 35;

  if (c.includes(q)) score += 20;
  if (s.includes(q)) score += 15;
  if (d.includes(q)) score += 8;

  const dist = fuzzyDistance(t, q);
  if (dist <= 1) score += 20;
  else if (dist <= 2) score += 10;

  score += Math.max(0, 10 - t.length / 5);

  if (item.rating) score += item.rating * 2;

  return score;
}

// ------------------------------------------------------
// PARSE PRICE
// ------------------------------------------------------
export const parsePrice = (price?: string): number => {
  if (!price) return 0;
  return Number(price.replace(/[^0-9.]/g, ""));
};

// ------------------------------------------------------
// MAIN SEARCH ENGINE
// ------------------------------------------------------
export function runSearch({
  query,
  collection,
  price,
  tier,
  sortBy,
}: {
  query?: string;
  collection?: string | null;
  price?: [number, number] | null;
  tier?: string[] | null;
  sortBy?: string | null;
}): Item[] {
  let results: Item[] = [];

  // 1. COLLECTION FILTER -----------------------------------------
  if (collection) {
    results = collectionsMap[collection] ?? [];
  } else {
    results = ALL_ITEMS;
  }

  // 2. TEXT SEARCH ------------------------------------------------
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();

    results = results
      .map((item) => ({
        ...item,
        __score: computeScore(item, q),
      }))
      .filter((i) => i.__score > 0)
      .sort((a, b) => b.__score - a.__score);
  }

  // 3. PRICE FILTER ----------------------------------------------
  if (price) {
    const [min, max] = price;

    results = results.filter((item) => {
      const value = parsePrice(item.price);
      return value >= min && value <= max;
    });
  }

  // 4. TIER FILTER (multi-select) --------------------------------
  if (tier && tier.length > 0) {
    results = results.filter((item) => tier.includes(item.tier ?? ""));
  }

  // 5. SORTING ----------------------------------------------------
  if (sortBy === "rating") {
    results = results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }
  if (sortBy === "price_low") {
    results = results.sort(
      (a, b) => parsePrice(a.price) - parsePrice(b.price)
    );
  }
  if (sortBy === "price_high") {
    results = results.sort(
      (a, b) => parsePrice(b.price) - parsePrice(a.price)
    );
  }

  return results;
}

// ------------------------------------------------------
// Lightweight text-only search for suggestions
// ------------------------------------------------------
export function searchItems(query: string): Item[] {
  return runSearch({
    query,
    collection: null,
    price: null,
    tier: null,
    sortBy: "relevance",
  });
}