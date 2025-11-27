import React, { useState } from "react";
import SearchResultsInfinite from "./SearchResultsInfinite";

export default function SearchResults({
  items,
  ItemCard,
  isLoading,
  hasMore,
  onLoadMore
}: {
  items: any[];
  ItemCard: React.ComponentType<{ item: any }>;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {

  const [activeTier, setActiveTier] = useState<string | null>(null);

  const selectTier = (tier: string | null) => {
    setActiveTier(tier);
  };

  return (
    <main className="grid grid-cols-[250px_1fr] gap-6">
      
      {/* ───── 📌 TIER SIDEBAR ───── */}
      <aside className="flex flex-col gap-2 p-3 border rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Tier</h3>

        {["S", "A", "B", "C"].map(t => (
          <button
            key={t}
            onClick={() => selectTier(t)}
            className={`px-3 py-1 rounded text-sm border ${
              activeTier === t ? "bg-black text-white" : "bg-white"
            }`}
          >
            Tier {t}
          </button>
        ))}

        {activeTier && (
          <button onClick={() => selectTier(null)} className="text-xs mt-2 underline opacity-70">
            Clear
          </button>
        )}
      </aside>

      {/* ───── RESULTS + FILTER ACTIVE ───── */}
      <SearchResultsInfinite
        items={items}
        ItemCard={ItemCard}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        filters={{ tier: activeTier ?? undefined }}
      />

    </main>
  );
}
