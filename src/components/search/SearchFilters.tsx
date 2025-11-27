// src/components/search/SearchFilters.tsx
import React from "react";
import { CollapsibleFilterSection } from "./CollapsibleFilterSection";
import PriceRangeSlider from "./PriceRangeSlider";

export default function SearchFilters({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: (f: any) => void;
}) {
  // helper to update a single key
  const update = (patch: Partial<typeof filters>) => {
    setFilters((prev: any) => ({ ...prev, ...patch }));
  };

  const clearFilter = (key: keyof typeof filters) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: null,
    }));
  };

  const categories = ["All", "Electronics", "Home", "Outdoors", "Apparel"];

  return (
    <aside>
      <CollapsibleFilterSection title="Categories" defaultOpen>
        <div className="flex flex-col gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => update({ category: c === "All" ? null : c })}
              className={`text-left rounded p-2 ${
                filters.category === c ? "bg-slate-100 font-semibold" : ""
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </CollapsibleFilterSection>

      <CollapsibleFilterSection title="Price">
        <PriceRangeSlider
          value={filters.price ?? [0, 1000]}
          onChange={(v) => update({ price: v })}
        />
      </CollapsibleFilterSection>

      <CollapsibleFilterSection title="Sort">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "relevance", label: "Relevance" },
            { key: "rating", label: "Rating" },
            { key: "price_low", label: "Price ↑" },
            { key: "price_high", label: "Price ↓" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => update({ sortBy: opt.key })}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                filters.sortBy === opt.key
                  ? "bg-black text-white border-black"
                  : "hover:bg-slate-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </CollapsibleFilterSection>

      {/* Tier Filter */}
      <CollapsibleFilterSection title="Tier">
        <div className="flex flex-wrap gap-2">
          {["S", "A", "B", "C"].map((tier) => (
            <button
              key={tier}
              onClick={() => update({ tier })}
              className={`px-3 py-1 text-sm rounded-md font-bold shadow-sm transition
          ${
            filters.tier === tier
              ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(191,90,255,.9)]"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
            >
              Tier {tier}
            </button>
          ))}

          {filters.tier && (
            <button
              onClick={() => clearFilter("tier")}
              className="text-xs underline text-gray-500 ml-2"
            >
              Clear
            </button>
          )}
        </div>
      </CollapsibleFilterSection>
    </aside>
  );
}
