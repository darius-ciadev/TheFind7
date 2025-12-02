import { Item } from "@/data/items";

/**
 * Convert price string "$199" → 199
 */
export const parsePrice = (price: any): number => {
  if (price == null) return NaN;

  // If already a number → return as-is
  if (typeof price === "number") return price;

  // If string like "$199" → extract digits
  if (typeof price === "string") {
    const cleaned = price.replace(/[^0-9.]/g, "");
    return cleaned ? Number(cleaned) : NaN;
  }

  return NaN;
};

/**
 * Filter by price range
 */
export const filterByPrice = (items: Item[], priceRange: [number, number] | null): Item[] => {
  if (!priceRange) return items;

  const [min, max] = priceRange;

  return items.filter((item) => {
    const value = parsePrice(item.price ?? "");
    return value >= min && value <= max;
  });
};


/**
 * Filter by minimum rating
 */
export const filterByRating = (items: Item[], minRating: number): Item[] => {
  return items.filter((item) => item.rating ?? 0 >= minRating);
};

/**
 * Simple text search (title + subtitle)
 */
export const searchItems = (items: Item[], query: string): Item[] => {
  if (!query.trim()) return items;

  const q = query.toLowerCase();

  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      (item.subtitle ?? "").toLowerCase().includes(q) // Fallback to empty string if subtitle is undefined
  );
};