"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  best_eco: { label: "Eco Choice", icon: "🌱" },
  best_cool: { label: "Cool Pick", icon: "😎" },
  best_utility: { label: "Best Utility", icon: "🧰" },
};

const PRICE_MAP: Record<string, string> = {
  budget: "Budget ($ - $$)",
  mid: "Mid-range ($$ - $$$)",
  premium: "Premium ($$$$)",
};

const SORT_MAP: Record<string, string> = {
  relevance: "Relevance",
  price_low: "Price: Low → High",
  price_high: "Price: High → Low",
  rating: "Top Rated",
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

  // COLLECTION
  if (filters.collection) {
    const col = COLLECTION_INFO[filters.collection];
    if (col) {
      pills.push({
        key: "collection",
        label: `${col.icon} ${col.label}`,
      });
    }
  }

  // PRICE
  if (filters.price) {
    pills.push({
      key: "price",
      label: `💲 ${PRICE_MAP[filters.price] ?? filters.price}`,
    });
  }

  // SORT (skip relevance)
  if (filters.sortBy && filters.sortBy !== "relevance") {
    pills.push({
      key: "sortBy",
      label: `⬍ ${SORT_MAP[filters.sortBy] ?? filters.sortBy}`,
    });
  }

  // TIER
  if (filters.tier) {
    pills.push({
      key: "tier",
      label: `🏷 Tier: ${filters.tier}`,
    });
  }

  if (pills.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="active-filters"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18 }}
        className="
          mb-6 flex flex-wrap items-center gap-2
        "
      >
        {pills.map((p, index) => (
          <motion.div
            key={p.key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, delay: index * 0.03 }}
          >
            <FilterChip
              selected
              removable
              size="sm"
              onRemove={() => onClearOne(p.key)}
            >
              {p.label}
            </FilterChip>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.18, delay: pills.length * 0.03 }}
        >
          <Button
            className="
              ml-2 text-black/60 hover:text-black
              hover:underline rounded-full px-3 py-1 text-sm
            "
            onClick={onClearAll}
          >
            Clear All
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
