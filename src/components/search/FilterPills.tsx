import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  return (
    <div className="sticky top-2 z-20 backdrop-blur-sm pb-3">
      <div className="flex flex-wrap gap-3 items-center px-1">

        <AnimatePresence>
          {query && (
            <motion.div {...pillAnim}>
              <button
                onClick={() => onClear("q")}
                className="pill">
                <span>🔍 {query}</span>
                <span className="close">✕</span>
              </button>
            </motion.div>
          )}

          {category && (
            <motion.div {...pillAnim}>
              <button onClick={() => onClear("category")} className="pill">
                <span>📂 {category}</span>
                <span className="close">✕</span>
              </button>
            </motion.div>
          )}

          {priceRange && (
            <motion.div {...pillAnim}>
              <button onClick={() => onClear("price")} className="pill">
                💰 ${priceRange[0]} – ${priceRange[1]}
                <span className="close">✕</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {(query || category || priceRange) && (
          <button onClick={onClearAll} className="text-sm underline opacity-70 hover:opacity-100">
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

const pillAnim = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6, scale: 0.9 },
  transition: {
    type: "spring",
    stiffness: 220,
    damping: 20,
  } as const,
};