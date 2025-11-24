import { categories, Category } from "@/data/categories";
import { items, Item } from "@/data/items";

/**
 * Convert between category key ("best_overall")
 * and category slug ("best-overall")
 */
export const getCategorySlug = (key: string) => key.replace(/_/g, "-");
export const getCategoryKey = (slug: string) => slug.replace(/-/g, "_");

/**
 * Find category by slug (URL-friendly)
 */
export const getCategoryBySlug = (slug: string): Category | undefined => {
  const key = getCategoryKey(slug);
  return categories.find((cat) => cat.key === key);
};

/**
 * Find category by internal key (data key)
 */
export const getCategoryByKey = (key: string): Category | undefined => {
  return categories.find((cat) => cat.key === key);
};

/**
 * Return all items matching a given category key
 */
export const getItemsForCategory = (key: string): Item[] => {
  return items.filter((item) => item.category === key);
};

/**
 * Example “related categories” logic:
 * All categories except the current one
 */
export const getRelatedCategories = (key: string, limit = 4): Category[] => {
  return categories
    .filter((cat) => cat.key !== key)
    .slice(0, limit);
};