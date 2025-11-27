// ------------------------------------------------------
// highlight.ts — Savvy Highlight v3
// Multi-keyword, fuzzy-friendly, synonym-aware highlighting
// ------------------------------------------------------

/**
 * Synonym dictionary for categories & concepts
 */
const SYNONYMS: Record<string, string[]> = {
  // user → matches
  cheap: ["value", "best_value"],
  budget: ["value", "best_value"],
  eco: ["eco", "best_eco_choice"],
  kids: ["kids", "best_for_kids", "cool_kids_choice"],
  premium: ["premium", "best_premium"],
  luxury: ["premium", "best_premium"],
};

/**
 * Build a list of keyword variants including synonyms
 */
export function getQueryVariants(query: string): string[] {
  if (!query) return [];

  // split multi-word queries: "eco pick" → ["eco", "pick"]
  const parts = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const expanded = new Set<string>();

  for (const p of parts) {
    expanded.add(p);

    if (SYNONYMS[p]) {
      for (const syn of SYNONYMS[p]) expanded.add(syn);
    }
  }

  return [...expanded];
}

/**
 * Smart substring that highlights BEST fuzzy match segment
 */
function bestFuzzyMatch(text: string, keyword: string): [number, number] | null {
  const t = text.toLowerCase();
  const k = keyword.toLowerCase();

  let bestIndex = -1;
  let bestDiff = Infinity;

  // sliding window fuzzy match
  for (let i = 0; i <= t.length - k.length; i++) {
    let diff = 0;
    for (let j = 0; j < k.length; j++) {
      if (t[i + j] !== k[j]) diff++;
      if (diff > 2) break; // more than 2 char differences = too fuzzy
    }
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = i;
    }
  }

  if (bestIndex === -1 || bestDiff > 2) return null;

  return [bestIndex, bestIndex + keyword.length];
}

// ------------------------------------------------------
// highlight.ts — Savvy Highlight v4
// Adaptive strength, animated, context-aware
// ------------------------------------------------------

function getStrengthClass(strength: "strong" | "medium" | "fuzzy") {
  switch (strength) {
    case "strong":
      return "bg-[var(--green)] text-white px-1 rounded transition-all duration-200 animate-highlight-strong";

    case "medium":
      return "bg-green-200 text-green-900 px-1 rounded transition-all duration-200 animate-highlight-medium";

    case "fuzzy":
    default:
      return "underline decoration-green-400 decoration-2 underline-offset-2 animate-highlight-fuzzy";
  }
}

/**
 * Main highlight function
 */
export function highlightSmart(text: string, query: string): string {
  if (!text || !query) return text;

  const variants = getQueryVariants(query);
  let output = text;

  // Sort longest first
  variants.sort((a, b) => b.length - a.length);

  for (const key of variants) {
    const safe = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const lower = output.toLowerCase();
    const lowerKey = key.toLowerCase();

    // STRONG MATCH — exact includes
    if (lower.includes(lowerKey)) {
      const regex = new RegExp(safe, "gi");
      output = output.replace(regex, (match) => {
        return `<mark class="${getStrengthClass("strong")}">${match}</mark>`;
      });
      continue;
    }

    // MEDIUM MATCH — partial inside words
    const partial = lower.indexOf(lowerKey.slice(0, Math.max(2, key.length - 1)));
    if (partial !== -1) {
      const start = partial;
      const end = partial + lowerKey.length;

      output =
        output.slice(0, start) +
        `<mark class="${getStrengthClass("medium")}">` +
        output.slice(start, end) +
        `</mark>` +
        output.slice(end);

      continue;
    }

    // FUZZY MATCH fallback
    const fuzz = bestFuzzyMatch(output, key);
    if (fuzz) {
      const [start, end] = fuzz;
      output =
        output.slice(0, start) +
        `<mark class="${getStrengthClass("fuzzy")}">` +
        output.slice(start, end) +
        `</mark>` +
        output.slice(end);
      continue;
    }
  }

  return output;
}
