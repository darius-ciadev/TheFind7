import React, { useState, useEffect, useMemo } from "react";
import SearchResultsInfinite from "./SearchResultsInfinite";
import { Item, searchItems } from "@/utils/searchEngine";

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

  const [filters, setFilters] = useState({ tier: null, category: null, price: null });
  const [allResults, setAllResults] = useState<Item[]>([]);

  const updateFilter = (key: string, value: any) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [key]: value };
      console.log("Filters updated:", updatedFilters);  // Debug filter update
      return updatedFilters;
    });
  };

  const selectTier = (tier: string | null) => {
    updateFilter("tier", tier);
  };


  useEffect(() => {
    const fetchData = async () => {
      const results = searchItems("query");  // Replace with actual logic for searchItems
      setAllResults(results);
      console.log("All results:", results); // Debug search result
    };
    fetchData();
  }, []);

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
              filters.tier === t ? "bg-black text-white" : "bg-white"
            }`}
          >
            Tier {t}
          </button>
        ))}

        {filters.tier && (
          <button onClick={() => selectTier(null)} className="text-xs mt-2 underline opacity-70">
            Clear
          </button>
        )}
      </aside>

      {/* ───── RESULTS + FILTER ACTIVE ───── */}
      <SearchResultsInfinite
        items={allResults}
        ItemCard={ItemCard}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        filters={filters}
      />

    </main>
  );
}
