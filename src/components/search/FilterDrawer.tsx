"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchFilters from "@/components/search/SearchFilters";

type Filters = {
  collection: string | null;
  price: [number, number] | null;
  sortBy: string;
  tier: string[];
};

type Pill = { key: string; label: string };

export default function FilterDrawer({
  open,
  onClose,
  filters,
  setFilters,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  const [pending, setPending] = useState<Filters>(filters);

  // sync when re-opening
  useEffect(() => {
    if (open) setPending(filters);
  }, [open, filters]);

  const applyChanges = () => {
    setFilters(pending);
    onClose();
  };

  const clearAll = () => {
    setPending({
      collection: null,
      price: null,
      sortBy: "relevance",
      tier: [],
    });
  };

  const activePills: Pill[] = useMemo(() => {
    const pills: Pill[] = [];

    if (pending.collection) {
      pills.push({
        key: "collection",
        label: `📁 ${pending.collection.replace(/_/g, " ")}`,
      });
    }

    if (pending.price) {
      const [min, max] = pending.price;
      pills.push({
        key: "price",
        label: `💰 $${min.toLocaleString()} – $${max.toLocaleString()}`,
      });
    }

    if (pending.sortBy && pending.sortBy !== "relevance") {
      const map: Record<string, string> = {
        price_low: "Price: Low → High",
        price_high: "Price: High → Low",
        rating: "Rating",
      };
      pills.push({
        key: "sortBy",
        label: map[pending.sortBy] || pending.sortBy,
      });
    }

    if (pending.tier?.length) {
      pills.push({
        key: "tier",
        label: `Tier ${pending.tier.join(", ")}`,
      });
    }

    return pills;
  }, [pending]);

  const removePill = (key: Pill["key"]) => {
    setPending((prev) => {
      if (key === "collection") return { ...prev, collection: null };
      if (key === "price") return { ...prev, price: null };
      if (key === "sortBy") return { ...prev, sortBy: "relevance" };
      if (key === "tier") return { ...prev, tier: [] };
      return prev;
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* ACTIVE PILLS */}
            {activePills.length > 0 && (
              <div className="px-6 pt-3 pb-2 border-b bg-white">
                <div className="flex flex-wrap gap-2 items-center">
                  {activePills.map((pill) => (
                    <button
                      key={pill.key}
                      type="button"
                      onClick={() => removePill(pill.key)}
                      className="
                        inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                        bg-black text-white text-xs font-medium
                      "
                    >
                      <span>{pill.label}</span>
                      <span className="text-[11px]">✕</span>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={clearAll}
                    className="ml-1 text-xs text-gray-600 hover:text-black underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <SearchFilters
                filters={pending}
                setFilters={setPending}
                mobile
              />
            </div>

            {/* FOOTER */}
            <div className="border-t px-6 py-4 bg-white flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:text-black font-medium"
              >
                Close
              </button>

              <button
                type="button"
                onClick={applyChanges}
                className="
                  px-6 py-2
                  bg-green-600 text-white rounded-lg
                  hover:bg-green-700
                  transition
                "
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
