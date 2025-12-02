import { getCategoryBySlug, getItemsForCategory } from "./category";
import {
  filterByPrice,
  filterByRating,
  searchItems,
} from "./filtering";
import {
  sortByRank,
  sortByPriceLowToHigh,
  sortByPriceHighToLow,
  sortByRating,
} from "./sorting";

export type SortOption =
  | "rank"
  | "price-low"
  | "price-high"
  | "rating";

export interface CategoryPageParams {
  slug: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: SortOption;
}

export const getCategoryPageData = (params: CategoryPageParams) => {
  const {
    slug,
    search = "",
    minPrice = 0,
    maxPrice = 99999,
    minRating = 0,
    sort = "rank",
  } = params;

  // 1) Load category
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { category: null, items: [] };
  }

  // 2) Load items for this category
  let items = getItemsForCategory(category.key);

  // 3) Apply search
  items = searchItems(items, search);

  // 4) Apply price range
  items = filterByPrice(items, [minPrice, maxPrice]);

  // 5) Minimum rating filter
  items = filterByRating(items, minRating);

  // 6) Sorting
  switch (sort) {
    case "price-low":
      items = sortByPriceLowToHigh(items);
      break;

    case "price-high":
      items = sortByPriceHighToLow(items);
      break;

    case "rating":
      items = sortByRating(items);
      break;

    case "rank":
    default:
      items = sortByRank(items);
      break;
  }

  // 7) Return
  return {
    category,
    items,
  };
};