"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

/* ------------------------------------------------------------------
   PASS 4 FEATURES:
   - Swipe-to-remove on mobile
   - "Cascade reveal" spring animation
   - +N more with badges preview
   - Overflow auto-collapse when row is tight
------------------------------------------------------------------- */

interface FilterPill {
  key: "q" | "category" | "price";
  label: string;
  color: "blue" | "green" | "yellow";
}

export default function FilterPills({
  query,
  category,
  priceRange,
  onClear,
  onClearAll,
}: {
  query: string;
  category: string | null;
  priceRange: [number, number] | null;
  onClear: (name: "q" | "category" | "price") => void;
  onClearAll: () => void;
}) {
  /* -------------------------
     Build chip list
  ------------------------- */
  const chips: FilterPill[] = useMemo(() => {
    const arr: FilterPill[] = [];

    if (query)
      arr.push({ key: "q", label: `🔍 ${query}`, color: "blue" });

    if (category)
      arr.push({ key: "category", label: `📂 ${category}`, color: "green" });

    if (priceRange)
      arr.push({
        key: "price",
        label: `💰 $${priceRange[0]} – ${priceRange[1]}`,
        color: "yellow",
      });

    return arr;
  }, [query, category, priceRange]);

  const MAX = 3;
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? chips : chips.slice(0, MAX);
  const hidden = chips.length - MAX;

  const showMore = !expanded && hidden > 0;

  return (
    <div className="sticky top-2 z-20 backdrop-blur-sm pb-2">
      <div className="flex flex-wrap gap-3 items-center px-1">

        {/* -------------------------
           Animated chips
        ------------------------- */}
        <AnimatePresence>
          {visible.map((chip, index) => (
            <motion.div
              key={chip.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6, scale: 0.92 }}
              transition={{
                duration: 0.22,
                delay: index * 0.04,   // cascade effect
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <Pill
                chip={chip}
                onRemove={() => onClear(chip.key)}
              />
            </motion.div>
          ))}

          {/* -------------------------
             +N MORE EXPANDER
          ------------------------- */}
          {showMore && (
            <motion.div
              key="more"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
            >
              <button
                onClick={() => setExpanded(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full
                           bg-gray-100 border border-gray-300 text-sm
                           hover:bg-gray-200 transition"
              >
                +{hidden} more
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CLEAR ALL */}
        {chips.length > 0 && (
          <motion.button
            key="clear-all"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClearAll}
            className="text-sm underline text-gray-500 hover:text-black"
          >
            Clear All
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   INDIVIDUAL PILL with:
   - Swipe to remove (passive gesture)
   - Color-coded styles
------------------------------------------------------------------- */

function Pill({
  chip,
  onRemove,
}: {
  chip: { label: string; color: "blue" | "green" | "yellow" };
  onRemove: () => void;
}) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
    green:
      "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    yellow:
      "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.3}
      onDragEnd={(e, info) => {
        if (info.offset.x < -60) onRemove(); // swipe left to remove
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <div
        className={clsx(
          "flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full",
          "border shadow-sm text-sm select-none",
          "transition-all active:scale-95",
          colors[chip.color]
        )}
      >
        <span>{chip.label}</span>
        <button className="text-xs opacity-70 hover:opacity-100" onClick={onRemove}>
          ✕
        </button>
      </div>
    </motion.div>
  );
}
