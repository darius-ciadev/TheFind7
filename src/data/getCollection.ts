import { Item } from "./items";

import { 
  best_overall,
  best_value,
  best_premium,
  best_kids,
  best_eco,
  cool_kids,
  best_utility
} from "./items";

export const collectionsMap: Record<string, Item[]> = {
    best_overall,
    best_value,
    best_premium,
    best_kids,
    best_eco,
    cool_kids,
    best_utility,
};

export function getCollectionItems(key: string | null): Item[] {
  if (!key) return [];
  return collectionsMap[key] ?? [];
}
