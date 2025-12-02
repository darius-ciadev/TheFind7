"use client";

import { FilterChip } from "./FilterChip";
import Button from "@/components/ui/button";

interface Filters {
  collection: string | null;
  price: string | null;
  sortBy: string | null;
  tier: string | null;
}

const COLLECTION_INFO: Record<string, { label: string; icon: string }> = {
  best_overall: { label: "Best Overall", icon: "🏅" },
  best_value: { label: "Best Value", icon: "💵" },
  best_premium: { label: "Best Premium", icon: "💎" },
  best_kids: { label: "Best for Kids", icon: "🧸" },
  best_eco: { label: "Best Eco Choice", icon: "🌱" },
  best_cool: { label: "Cool Kids’ Choice", icon: "😎" },
  best_utility: { label: "Best Utility Pick", icon: "🧰" },
};

export default function ActiveFilters({
  filters,
  onClearOne,
  onClearAll,
}: {
  filters: Filters;
  onClearOne: (key: string) => void;
  onClearAll: () => void;
}) {
  const pills: { key: string; label: string }[] = [];

  // -----------------------------
  // COLLECTION (NEW)
  // -----------------------------
  if (filters.collection) {
    const col = COLLECTION_INFO[filters.collection];
    if (col) {
      pills.push({
        key: "collection",
        label: `${col.icon} ${col.label}`,
      });
    }
  }

  // -----------------------------
  // PRICE
  // -----------------------------
  if (filters.price) {
    const priceMap = {
      budget: "Budget ($ - $$)",
      mid: "Mid-range ($$ - $$$)",
      premium: "Premium ($$$$)",
    } as const;

    pills.push({
      key: "price",
      label: `Price: ${
        priceMap[filters.price as keyof typeof priceMap] || filters.price
      }`,
    });
  }

  // -----------------------------
  // SORT (hide relevance)
  // -----------------------------
  if (filters.sortBy && filters.sortBy !== "relevance") {
    const sortMap = {
      relevance: "Relevance",
      price_low: "Price: Low → High",
      price_high: "Price: High → Low",
      rating: "Rating",
    } as const;

    pills.push({
      key: "sortBy",
      label:
        sortMap[filters.sortBy as keyof typeof sortMap] ||
        "Unknown Sort Option",
    });
  }

  // -----------------------------
  // TIER
  // -----------------------------
  if (filters.tier) {
    pills.push({
      key: "tier",
      label: `Tier: ${filters.tier}`,
    });
  }

  // -----------------------------
  // NO FILTERS
  // -----------------------------
  if (pills.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 animate-fadeInSm">
      {pills.map((p) => (
        <FilterChip
          key={p.key}
          removable
          size="sm"
          onRemove={() => onClearOne(p.key)}
        >
          {p.label}
        </FilterChip>
      ))}

      <Button
        className="ml-2 text-black/60 hover:text-black"
        onClick={onClearAll}
      >
        Clear All
      </Button>
    </div>
  );
}