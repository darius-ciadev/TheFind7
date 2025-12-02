"use client";

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
  const update = (patch: Partial<typeof filters>) => {
    setFilters((prev: any) => ({ ...prev, ...patch }));
  };

  // ------------------------------------------
  // COLLECTIONS (curated groups from homepage)
  // ------------------------------------------
  const collections = [
    { key: "best_overall", label: "Best Overall", icon: "🏅" },
    { key: "best_value", label: "Best Value", icon: "💵" },
    { key: "best_premium", label: "Best Premium", icon: "💎" },
    { key: "best_for_kids", label: "Best for Kids", icon: "👶" },
    { key: "best_eco", label: "Best Eco Choice", icon: "🌍" },
    { key: "cool_kids", label: "Cool Kids' Choice", icon: "😎" },
    { key: "best_utility", label: "Best Utility Pick", icon: "🧰" },
  ];

  return (
    <aside className="space-y-6 md:w-64 md:pr-4 w-full animate-fadeInSm">

      {/* ------------------------------------- */}
      {/* COLLECTIONS */}
      {/* ------------------------------------- */}
      <CollapsibleFilterSection title="Collections" defaultOpen>
        <div className="flex flex-col gap-2">
          {collections.map((col) => {
            const active = filters.collection === col.key;

            return (
              <button
                key={col.key}
                onClick={() =>
                  update({ collection: active ? null : col.key })
                }
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg border
                  text-sm transition-all
                  ${
                    active
                      ? "bg-black text-white border-black shadow-sm"
                      : "border-slate-200 hover:bg-slate-100"
                  }
                `}
              >
                <span className="text-lg">{col.icon}</span>
                {col.label}
              </button>
            );
          })}
        </div>
      </CollapsibleFilterSection>

      {/* ------------------------------------- */}
      {/* PRICE RANGE */}
      {/* ------------------------------------- */}
      <CollapsibleFilterSection title="Price">
        <div className="px-3 pb-3">
          <PriceRangeSlider
            value={filters.price ?? [0, 1000]}
            onChange={(v) => update({ price: v })}
          />
        </div>
      </CollapsibleFilterSection>

      {/* ------------------------------------- */}
      {/* SORT */}
      {/* ------------------------------------- */}
      <CollapsibleFilterSection title="Sort">
        <div className="flex flex-wrap gap-2 mt-1">
          {[
            { key: "relevance", label: "Relevance" },
            { key: "rating", label: "Rating" },
            { key: "price_low", label: "Price: Low → High" },
            { key: "price_high", label: "Price: High → Low" },
          ].map((opt) => {
            const active = filters.sortBy === opt.key;

            return (
              <button
                key={opt.key}
                onClick={() => update({ sortBy: opt.key })}
                className={`
                  px-3 py-1.5 rounded-full border text-sm transition-all
                  ${
                    active
                      ? "bg-black text-white border-black shadow-sm"
                      : "border-slate-300 hover:bg-slate-100"
                  }
                `}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </CollapsibleFilterSection>

      {/* ------------------------------------- */}
      {/* TIER (S / A / B / C) */}
      {/* ------------------------------------- */}
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
            const updated = active
              ? filters.tier.filter((t: string) => t !== tier)
              : [...(filters.tier || []), tier];

            update({ tier: updated });
          }}
          className={`
            flex flex-col items-center justify-center p-3 rounded-lg 
            font-semibold tracking-wide shadow-sm w-full text-sm
            bg-gradient-to-br ${bg} ${text} transition-all

            ${
              active
                ? "scale-[1.03] ring-2 ring-black/25 shadow-[0_0_12px_rgba(0,0,0,0.18)]"
                : "opacity-90 hover:opacity-100 hover:scale-[1.02]"
            }
          `}
        >
          <span className="text-xl leading-none">{icon}</span>
          <span className="mt-1 text-xs">{label}</span>
        </Button>
      );
    })}

    {filters.tier?.length > 0 && (
      <Button
        onClick={() => update({ tier: [] })}
        className="text-sm underline text-gray-600 mt-2 col-span-2 text-center hover:text-black py-1"
      >
        Clear Tier Filter
      </Button>
    )}
  </div>
</CollapsibleFilterSection>

    </aside>
  );
}
