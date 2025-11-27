// ------------------------------------------------------
// Search Engine v3 — Clean + Fuzzy + Weighted
// ------------------------------------------------------

import { items as rawItems } from "@/data/items";

export type Item = {
  slug: string;
  title: string;
  category: string;
  subtitle?: string;
  image?: string;
  price?: string;
  rating?: number;
  description?: string;
  tier?: string;
  [k: string]: any;
};

const items: Item[] = Array.isArray(rawItems) ? rawItems : [];

// Safe lowercase helper
const low = (v: any) =>
  v === undefined || v === null ? "" : String(v).toLowerCase();

// ------------------------------------------------------
// Levenshtein distance (fuzzy match)
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
// Compute weighted score for a single item
// ------------------------------------------------------
function computeScore(item: Item, q: string): number {
  const t = low(item.title);
  const c = low(item.category);
  const s = low(item.subtitle);
  const d = low(item.description);

  let score = 0;

  // --- Strong matches ---
  if (t.startsWith(q)) score += 50;
  if (t.includes(q)) score += 35;

  // --- Medium matches ---
  if (c.includes(q)) score += 20;
  if (s.includes(q)) score += 15;
  if (d.includes(q)) score += 8;

  // --- Fuzzy match / typo tolerance ---
  const dist = fuzzyDistance(t, q);
  if (dist <= 1) score += 20;
  else if (dist <= 2) score += 10;

  // --- Short titles slightly boosted ---
  score += Math.max(0, 10 - t.length / 5);

  // --- Rating score ---
  if (item.rating) score += item.rating * 2;

  return score;
}

// ------------------------------------------------------
// MAIN SEARCH FUNCTION
// ------------------------------------------------------
export function searchItems(query: string): Item[] {
  if (!query || typeof query !== "string") return [];

  const q = query.toLowerCase().trim();
  if (!q) return [];

  return items
    .map((item) => ({
      ...item,
      __score: computeScore(item, q),
    }))
    .filter((i) => i.__score > 0)
    .sort((a, b) => b.__score - a.__score);
}

export { items };

export function filterByTier(items: Item[], tier: string | null): Item[] {
  if (!tier) return items;
  return items.filter((item) => item.tier === tier);
}