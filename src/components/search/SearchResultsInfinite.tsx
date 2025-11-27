import React, { useRef, useEffect, useMemo } from "react";
import { getTier } from "@/lib/getTier";

export default function SearchResultsInfinite({
  items,
  ItemCard,
  isLoading,
  hasMore,
  onLoadMore,
  filters
}: {
  items: any[];
  ItemCard: React.ComponentType<{ item: any }>;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  filters?: { tier?: string }; 
}) {
  const sentinel = useRef<HTMLDivElement | null>(null);

  // Step 1: Filter items by tier (if applicable)
  const filteredItems = useMemo(() => {
    // If a tier filter is set, filter items based on their tier
    if (filters?.tier) {
      return items.filter((item) => getTier(item) === filters.tier);
    }
    // Otherwise, return all items
    return items;
  }, [items, filters?.tier]);  // Recalculate whenever items or filters.tier change

  // Step 2: Set up infinite scroll observer
  useEffect(() => {
    if (!sentinel.current || !hasMore) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && onLoadMore());
      },
      { rootMargin: "300px" }
    );

    obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [onLoadMore, hasMore]);

  return (
    <>
      {/* Display filtered items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((it) => (
          <ItemCard key={it.id} item={it} />
        ))}
      </div>

      {/* Loading more or no more results */}
      <div className="mt-6 flex flex-col items-center">
        {isLoading && <div className="py-4">Loading more...</div>}
        {!hasMore && (
          <div className="py-4 text-sm text-gray-500">No more results</div>
        )}
        <div ref={sentinel} style={{ height: 1 }} />
      </div>
    </>
  );
}
