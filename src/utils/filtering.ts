import { Item } from "@/data/items";

/**
 * Convert price string "$199" → 199
 */
export const parsePrice = (price: string): number => {
  return Number(price.replace(/[^0-9.]/g, ""));
};

/**
 * Filter by price range
 */
export const filterByPrice = (
  items: Item[],
  min: number,
  max: number
): Item[] => {
  return items.filter((item) => {
    const value = parsePrice(item.price);
    return value >= min && value <= max;
  });
};

/**
 * Filter by minimum rating
 */
export const filterByRating = (items: Item[], minRating: number): Item[] => {
  return items.filter((item) => item.rating >= minRating);
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
      item.subtitle.toLowerCase().includes(q)
  );
};