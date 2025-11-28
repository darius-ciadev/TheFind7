// src/components/search/SearchFilters.tsx
import React from "react";
import { CollapsibleFilterSection } from "./CollapsibleFilterSection";
import PriceRangeSlider from "./PriceRangeSlider";
import Button from "../ui/button";

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

  const toggleTier = (tier: string) => {
    setFilters((prev: any) => {
      const exists = prev.tier.includes(tier);
      return {
        ...prev,
        tier: exists
          ? prev.tier.filter((t: string) => t !== tier)
          : [...prev.tier, tier],
      };
    });
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

      <CollapsibleFilterSection title="Tier">
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            {
              tier: "S",
              label: "Tier S",
              icon: "💎",
              bg: "from-purple-500 to-pink-500",
              text: "text-white",
            },
            {
              tier: "A",
              label: "Tier A",
              icon: "🔥",
              bg: "from-orange-500 to-red-500",
              text: "text-white",
            },
            {
              tier: "B",
              label: "Tier B",
              icon: "⭐",
              bg: "from-yellow-300 to-amber-300",
              text: "text-black",
            },
            {
              tier: "C",
              label: "Tier C",
              icon: "⚪",
              bg: "from-gray-200 to-gray-300",
              text: "text-gray-800",
            },
          ].map(({ tier, label, icon, bg, text }) => {
            const active = filters.tier?.includes?.(tier);

            return (
              <Button
                key={tier}
                onClick={() => {
                  const current = filters.tier || [];
                  const updated = active
                    ? current.filter((t:string) => t !== tier)
                    : [...current, tier];
                  update({ tier: updated });
                }}
                className={`
            flex items-center justify-center gap-2 py-3 rounded-xl 
            font-semibold uppercase tracking-wide shadow-md
            bg-gradient-to-br ${bg} ${text} transition-all

            ${
              active
                ? "scale-[1.05] ring-2 ring-black/20 shadow-[0_0_18px_rgba(0,0,0,0.25)]"
                : "opacity-80 hover:opacity-100"
            }
          `}
              >
                <span className="text-lg">{icon}</span>
                {label}
              </Button>
            );
          })}

          {filters.tier?.length > 0 && (
            <Button
              onClick={() => update({ tier: [] })}
              className="text-sm underline text-gray-500 mt-2 col-span-2 text-center"
            >
              Clear Tier Filter
            </Button>
          )}
        </div>
      </CollapsibleFilterSection>
    </aside>
  );
}
