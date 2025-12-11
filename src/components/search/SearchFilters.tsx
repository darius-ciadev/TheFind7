"use client";

import React from "react";
import { motion } from "framer-motion";
import { CollapsibleFilterSection } from "./CollapsibleFilterSection";
import PriceRangeSlider from "./PriceRangeSlider";

const formatNumber = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("en-US") : "";

export default function SearchFilters({
  filters,
  setFilters,
  mobile = false,
}: {
  filters: any;
  setFilters: (f: any) => void;
  mobile?: boolean;
}) {
  const update = (patch: Partial<typeof filters>) => {
    setFilters((prev: any) => ({ ...prev, ...patch }));
  };

  const collections = [
    { key: "best_overall", label: "Best Overall", icon: "🏅" },
    { key: "best_value", label: "Best Value", icon: "💵" },
    { key: "best_premium", label: "Best Premium", icon: "💎" },
    { key: "best_for_kids", label: "Best for Kids", icon: "🧸" },
    { key: "best_eco", label: "Best Eco Choice", icon: "🌱" },
    { key: "cool_kids", label: "Cool Kids' Choice", icon: "😎" },
    { key: "best_utility", label: "Best Utility Pick", icon: "🧰" },
  ];

  // ----- price helpers -----
  const priceValue: [number, number] = filters.price ?? [0, 9999];
  const [min, max] = priceValue;
  const minInvalid = min > max;
  const maxInvalid = max < min;

  return (
    <aside className="space-y-8 w-full animate-fadeInSm">
      {/* COLLECTIONS */}
      <CollapsibleFilterSection
        title="Collections"
        defaultOpen
        canClear={Boolean(filters.collection)}
        onClear={() => update({ collection: null })}
      >
        <div className="grid grid-cols-1 gap-2">
          {collections.map((c) => {
            const active = filters.collection === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() =>
                  update({ collection: active ? null : c.key })
                }
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl border text-[15px]
                  transition-all duration-200 shadow-sm
                  ${
                    active
                      ? "bg-[var(--green)]/10 border-[var(--green)] text-[var(--green)] font-semibold"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <span className="text-lg">{c.icon}</span>
                {c.label}
              </button>
            );
          })}
        </div>
      </CollapsibleFilterSection>

      {/* PRICE */}
      <CollapsibleFilterSection
        title="Price"
        canClear={Boolean(filters.price)}
        onClear={() => update({ price: null })}
      >
        <div className="space-y-5 px-1 pb-2">
          {/* Header + live preview */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-gray-600">
              Set your price range
            </span>

            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold text-[var(--green)]"
            >
              💰 ${formatNumber(min)} – ${formatNumber(max)}
            </motion.span>
          </div>

          {/* Inputs */}
          <div className="flex items-center gap-3">
            {/* MIN */}
            <div
              className={`
                flex-1 px-3 py-2 rounded-lg border text-sm bg-gray-50
                transition-all
                ${
                  minInvalid
                    ? "border-red-500 ring-2 ring-red-300"
                    : "border-gray-300 focus-within:border-[var(--green)] focus-within:ring-2 focus-within:ring-[var(--green)]"
                }
              `}
            >
              <input
                type="text"
                className="w-full bg-transparent outline-none"
                value={formatNumber(min)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  const newMin = raw === "" ? 0 : Number(raw);
                  update({ price: [newMin, max] });
                }}
              />
            </div>

            <span className="font-medium text-gray-400">—</span>

            {/* MAX */}
            <div
              className={`
                flex-1 px-3 py-2 rounded-lg border text-sm bg-gray-50
                transition-all
                ${
                  maxInvalid
                    ? "border-red-500 ring-2 ring-red-300"
                    : "border-gray-300 focus-within:border-[var(--green)] focus-within:ring-2 focus-within:ring-[var(--green)]"
                }
              `}
            >
              <input
                type="text"
                className="w-full bg-transparent outline-none"
                value={formatNumber(max)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  const newMax = raw === "" ? 0 : Number(raw);
                  update({ price: [min, newMax] });
                }}
              />
            </div>
          </div>

          {/* Slider */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="pt-1"
          >
            <PriceRangeSlider
              value={priceValue}
              onChange={([nextMin, nextMax]) => {
                let newMin = nextMin;
                let newMax = nextMax;
                if (newMin > newMax) newMin = newMax - 1;
                if (newMax < newMin) newMax = newMin + 1;
                update({ price: [newMin, newMax] });
              }}
            />
          </motion.div>
        </div>
      </CollapsibleFilterSection>

      {/* SORT */}
      <CollapsibleFilterSection
        title="Sort"
        canClear={filters.sortBy && filters.sortBy !== "relevance"}
        onClear={() => update({ sortBy: "relevance" })}
      >
        <div className="flex flex-col gap-2">
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
                type="button"
                onClick={() => update({ sortBy: opt.key })}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl border text-[15px]
                  transition-all duration-200 shadow-sm
                  ${
                    active
                      ? "bg-[var(--green)]/10 border-[var(--green)] text-[var(--green)] font-semibold"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </CollapsibleFilterSection>

      {/* TIER */}
      <CollapsibleFilterSection
        title="Tier"
        canClear={Array.isArray(filters.tier) && filters.tier.length > 0}
        onClear={() => update({ tier: [] })}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              tier: "S",
              icon: "💎",
              bg: "from-purple-500 to-pink-500",
              text: "text-white",
            },
            {
              tier: "A",
              icon: "🔥",
              bg: "from-orange-500 to-red-500",
              text: "text-white",
            },
            {
              tier: "B",
              icon: "⭐",
              bg: "from-yellow-300 to-amber-300",
              text: "text-black",
            },
            {
              tier: "C",
              icon: "⚪",
              bg: "from-gray-200 to-gray-300",
              text: "text-gray-800",
            },
          ].map(({ tier, icon, bg, text }) => {
            const active = filters.tier?.includes(tier);

            return (
              <button
                key={tier}
                type="button"
                onClick={() =>
                  update({
                    tier: active
                      ? filters.tier.filter((t: string) => t !== tier)
                      : [...(filters.tier || []), tier],
                  })
                }
                className={`
                  p-3 rounded-lg text-sm font-semibold shadow-sm
                  bg-gradient-to-br ${bg} ${text}
                  transition-all
                  ${
                    active
                      ? "scale-[1.03] ring-2 ring-black/20 shadow-lg"
                      : "opacity-90 hover:opacity-100 hover:scale-[1.02]"
                  }
                `}
              >
                <span className="text-xl">{icon}</span>
                <div className="mt-1 text-xs">Tier {tier}</div>
              </button>
            );
          })}
        </div>
      </CollapsibleFilterSection>
    </aside>
  );
}
