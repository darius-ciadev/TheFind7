"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { devPlaceholder } from "@/utils/devPlaceholder";
import { items as allItems } from "@/data/items";
import { useCompare } from "@/hooks/useCompare";

/* -----------------------------------------
   Mini Item Drawer for Details
----------------------------------------- */
function ItemDrawer({
  item,
  onClose,
}: {
  item: any;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="
        fixed bottom-28 left-1/2 -translate-x-1/2
        bg-white shadow-xl rounded-2xl p-5 w-[90vw] max-w-sm
        z-[9999] border
      "
    >
      <h3 className="font-bold text-lg mb-2">{item.title}</h3>

      <div className="flex items-center gap-3 mb-3">
        <Image
          src={devPlaceholder(item.image)}
          alt={item.title}
          width={70}
          height={70}
          className="rounded-lg object-cover"
        />
        <div className="text-sm">
          <div className="text-neutral-700">⭐ {item.rating}</div>
          <div className="font-medium">{item.price}</div>
          <div className="text-neutral-500 text-xs">{item.category}</div>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <Link
          href={`/${item.category.replace(/_/g, "-")}/${item.slug}`}
          className="flex-1 py-2 rounded-md bg-[var(--green)] text-white text-center"
        >
          View Product
        </Link>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border text-sm"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}

/* -----------------------------------------
   CompareBar V3
----------------------------------------- */
export default function CompareBar() {
  const {
    items: compareSlugs,
    setItems,
    remove,
    clear,
  } = useCompare();

  /* Derived selected items */
  const selected = allItems.filter((i) => compareSlugs.includes(i.slug));

  /* Hooks ALWAYS FIRST */
  const scrollRef = useRef<HTMLDivElement>(null);

  const [drawerItem, setDrawerItem] = useState<any | null>(null);

  const [docked, setDocked] = useState(false);
  const lastScroll = useRef(0);

  /* Scroll → Dock logic */
  useEffect(() => {
    const handle = () => {
      const y = window.scrollY;
      if (y < lastScroll.current - 40) setDocked(true);
      else if (y > lastScroll.current + 40) setDocked(false);
      lastScroll.current = y;
    };

    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  /* Auto-scroll on add */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [selected.length]);

  if (compareSlugs.length === 0) return null;

  return (
    <>
      {/* Docked mode wrapper */}
      <div
        className={`
          fixed left-1/2 -translate-x-1/2 z-[500]
          transition-all duration-300
          ${docked ? "top-2" : "bottom-6"}
          w-full max-w-4xl px-4
        `}
      >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="
              bg-white border shadow-2xl rounded-2xl 
              px-4 py-3 flex items-center justify-between
              relative overflow-hidden
            "
          >
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent"></div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent"></div>

            {/* Draggable list */}
            <Reorder.Group
              axis="x"
              values={compareSlugs}
              onReorder={(newOrder) => setItems(newOrder)}
              className="flex items-center gap-4 overflow-x-auto no-scrollbar max-w-[60vw] md:max-w-[50vw] pr-4"
              ref={scrollRef}
            >
              {selected.map((it) => (
                <Reorder.Item
                  key={it.slug}
                  value={it.slug}
                  className="relative flex items-center gap-3 shrink-0 group cursor-grab active:cursor-grabbing"
                  whileDrag={{ scale: 1.1, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
                >
                  {/* Remove button */}
                  <button
                    onClick={() => remove(it.slug)}
                    className="
                      absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center
                      bg-black/70 text-white text-xs rounded-full opacity-0
                      group-hover:opacity-100 transition
                    "
                  >
                    ×
                  </button>

                  {/* Click to expand drawer */}
                  <div
                    onClick={() => setDrawerItem(it)}
                    className="w-11 h-11 rounded-lg bg-neutral-100 overflow-hidden shadow-sm active:scale-95 transition"
                  >
                    <Image
                      src={devPlaceholder(it.image)}
                      alt={it.title}
                      width={80}
                      height={60}
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{it.title}</p>
                    <p className="text-xs text-neutral-500">{it.price}</p>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Count */}
              <motion.span
                key={compareSlugs.length}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="text-[var(--green)] font-semibold"
              >
                {compareSlugs.length}
              </motion.span>

              {/* Compare button */}
              <Link
                href={`/compare?items=${compareSlugs.join(",")}`}
                className={`
                  px-4 py-2 rounded-lg font-semibold text-white 
                  whitespace-nowrap transition 
                  ${
                    compareSlugs.length >= 2
                      ? "bg-[var(--green)] glow-pulse"
                      : "bg-neutral-400 cursor-not-allowed"
                  }
                `}
              >
                Compare →
              </Link>

              <button
                onClick={clear}
                className="text-sm text-neutral-600 hover:text-red-500 transition"
              >
                Clear
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerItem && (
          <ItemDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />
        )}
      </AnimatePresence>

      {/* Glow keyframe */}
      <style jsx global>{`
        @keyframes glowPulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 150, 80, 0.4); }
          70% { box-shadow: 0 0 18px 10px rgba(0, 150, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 150, 80, 0); }
        }
        .glow-pulse {
          animation: glowPulse 1.8s infinite;
        }
      `}</style>
    </>
  );
}
