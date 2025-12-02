"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { getTier } from "@/lib/getTier";

type Filters = {
  tier?: string | null;          // "S", "A", "B", "C"
  price?: string | null;         // "budget" | "mid" | "premium"
  collection?: string | null;    // curated category key
};

export default function SearchResultsInfinite({
  items,
  ItemCard,
  isLoading,
  hasMore,
  onLoadMore,
  filters = {},
}: {
  items: any[];
  ItemCard: React.ComponentType<{ item: any }>;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  filters?: Filters;
}) {
  
  const sentinel = useRef<HTMLDivElement | null>(null);

  // -------------------------------------------------------
  // PRICE HELPER
  // -------------------------------------------------------
  const priceNum = (price: string | undefined) =>
    parseFloat(price?.replace(/[^0-9.]/g, "") || "0");

  // -------------------------------------------------------
  // APPLY ALL FILTERS IN ONE MEMO BLOCK
  // -------------------------------------------------------
  const filteredItems = useMemo(() => {
    let arr = [...items];

    // 1) COLLECTION (category)
    if (filters.collection) {
      arr = arr.filter((i) => i.category === filters.collection);
    }

    // 2) TIER
    if (filters.tier) {
      arr = arr.filter((i) => getTier(i) === filters.tier);
    }

    // 3) PRICE RANGE GROUPS
    if (filters.price) {
      arr = arr.filter((i) => {
        const p = priceNum(i.price);

        if (filters.price === "budget") return p <= 50;
        if (filters.price === "mid") return p > 50 && p <= 150;
        if (filters.price === "premium") return p > 150;

        return true;
      });
    }

    return arr;
  }, [items, filters.collection, filters.tier, filters.price]);

  // -------------------------------------------------------
  // INFINITE SCROLL
  // -------------------------------------------------------
  useEffect(() => {
    if (!sentinel.current || !hasMore) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) onLoadMore();
        });
      },
      { rootMargin: "300px" }
    );

    obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [onLoadMore, hasMore]);

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <>
      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ItemCard key={item.slug || item.id} item={item} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div className="mt-6 flex flex-col items-center">
        {isLoading && <div className="py-4 text-sm text-gray-600">Loading...</div>}
        {!hasMore && (
          <div className="py-4 text-sm text-gray-500">No more results</div>
        )}
        <div ref={sentinel} style={{ height: 1 }} />
      </div>
    </>
  );
}