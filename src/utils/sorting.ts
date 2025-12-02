import { Item } from "@/data/items";
import { parsePrice } from "./filtering";

/**
 * Since your TS file lists items in rank order,
 * we keep them exactly as-is (stable)
 */
export const sortByRank = (items: Item[]): Item[] => {
  return [...items]; // unmodified order
};

/**
 * Sort by price (low → high)
 */
export const sortByPriceLowToHigh = (items: Item[]): Item[] => {
  return [...items].sort(
    (a, b) => parsePrice(a.price ?? "0") - parsePrice(b.price ?? "0")
  );
};

/**
 * Sort by price (high → low)
 */
export const sortByPriceHighToLow = (items: Item[]): Item[] => {
  return [...items].sort(
    (a, b) => parsePrice(b.price ?? "0") - parsePrice(a.price ?? "0")
  );
};

/**
 * Sort by user rating
 */
export const sortByRating = (items: Item[]): Item[] => {
  return [...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
};

export function priceGroup(priceRaw?: string | number): "budget" | "mid" | "premium" | null {
  if (!priceRaw) return null;

  const p = typeof priceRaw === "string"
    ? parseFloat(priceRaw.replace("$", ""))
    : priceRaw;

  if (isNaN(p)) return null;

  if (p <= 50) return "budget";
  if (p <= 150) return "mid";
  return "premium";
}
