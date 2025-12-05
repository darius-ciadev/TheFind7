"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { items as allItems, Item } from "@/data/items";
import { devPlaceholder } from "@/utils/devPlaceholder";

// -----------------------------
// Helper parsers
// -----------------------------
function parsePrice(p?: string | number) {
  if (p == null) return NaN;
  const s = String(p).replace(/[^0-9.]/g, "");
  return Number(s) || NaN;
}

function clamp(v: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, v));
}

export default function ComparePage() {
  const router = useRouter();
  const { items: queryItems } = router.query;

  const selectedSlugs = typeof queryItems === "string" ? queryItems.split(",") : [];

  const selectedItems = useMemo(() => {
    return allItems.filter((it) => selectedSlugs.includes(it.slug));
  }, [selectedSlugs]);

  // refs for scroll-sync
  const headerRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const head = headerRef.current;
    const body = bodyRef.current;
    if (!head || !body) return;

    const sync = () => (head.scrollLeft = body.scrollLeft);
    body.addEventListener("scroll", sync);
    return () => body.removeEventListener("scroll", sync);
  }, []);

  // hover highlight
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // difference mode
  const [differencesOnly, setDifferencesOnly] = useState(false);

  // compute numeric extremes
  const stats = useMemo(() => {
    const priceVals = selectedItems.map((i) => parsePrice(i.price));
    const ratingVals = selectedItems.map((i) => Number(i.rating ?? 0));

    const maxPrice = Math.max(...priceVals.filter((v) => !Number.isNaN(v)));
    const minPrice = Math.min(...priceVals.filter((v) => !Number.isNaN(v)));
    const maxRating = Math.max(...ratingVals);
    const minRating = Math.min(...ratingVals);

    return { priceVals, ratingVals, maxPrice, minPrice, maxRating, minRating };
  }, [selectedItems]);

  const isBestPrice = (p: number) => !Number.isNaN(p) && p === stats.minPrice;
  const isWorstPrice = (p: number) => !Number.isNaN(p) && p === stats.maxPrice;
  const isBestRating = (r: number) => r === stats.maxRating;
  const isWorstRating = (r: number) => r === stats.minRating;

  // rows definition
  const rows = useMemo(() => {
    return [
      {
        key: "price",
        label: "Price",
        render: (it: Item) => it.price || "—",
        valueForCompare: (it: Item) => parsePrice(it.price),
      },
      {
        key: "rating",
        label: "Rating",
        render: (it: Item) => (
          <div className="flex items-center justify-center gap-2">
            <span className="font-medium">⭐ {it.rating ?? 0}</span>
            <div className="w-28 h-2 bg-neutral-100 rounded overflow-hidden">
              <div
                style={{ width: `${clamp(((Number(it.rating ?? 0) / 5) * 100), 0, 100)}%` }}
                className="h-full bg-[var(--green)]"
              />
            </div>
          </div>
        ),
        valueForCompare: (it: Item) => Number(it.rating ?? 0),
      },
      {
        key: "pros",
        label: "Pros",
        tall: true,
        render: () => (
          <ul className="space-y-1 text-neutral-700 text-left md:text-center">
            <li>• Great build quality</li>
            <li>• Strong user ratings</li>
            <li>• Good value for money</li>
          </ul>
        ),
        valueForCompare: () => null,
      },
      {
        key: "cons",
        label: "Cons",
        tall: true,
        render: () => (
          <ul className="space-y-1 text-neutral-700 text-left md:text-center">
            <li>• Limited color options</li>
            <li>• Availability varies</li>
          </ul>
        ),
        valueForCompare: () => null,
      },
      {
        key: "availability",
        label: "Availability",
        render: () => "✓ In stock",
        valueForCompare: () => null,
      },
      {
        key: "actions",
        label: "Actions",
        render: (it: Item) => (
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/${it.category.replace(/_/g, "-")}/${it.slug}`}
              className="inline-block px-4 py-2 rounded-lg border hover:bg-neutral-50 transition"
            >
              View
            </Link>
            <button
              className="px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200"
              onClick={() => {
                const remaining = selectedSlugs.filter((s) => s !== it.slug);
                router.push({
                  pathname: "/compare",
                  query: remaining.length ? { items: remaining.join(",") } : {},
                });
              }}
            >
              Remove
            </button>
          </div>
        ),
        valueForCompare: () => null,
      },
    ];
  }, [selectedItems, router]);

  // difference calculation
  const diffs = useMemo(() => {
    const map: Record<string, boolean> = {};
    rows.forEach((r) => {
      if (!r.valueForCompare) return (map[r.key] = false);
      const vals = selectedItems.map((it) => r.valueForCompare(it));
      const unique = Array.from(new Set(vals.map((v) => String(v))));
      map[r.key] = unique.length > 1;
    });
    return map;
  }, [rows, selectedItems]);

  const removeItem = (slug: string) => {
    const remaining = selectedSlugs.filter((s) => s !== slug);
    router.push({
      pathname: "/compare",
      query: remaining.length ? { items: remaining.join(",") } : {},
    });
  };

  const openAddFlow = () => {
    router.push("/categories");
  };

  const getHighlightClass = (rowKey: string, it: Item) => {
    if (rowKey === "price") {
      const v = parsePrice(it.price);
      if (Number.isFinite(v)) {
        if (isBestPrice(v)) return "bg-green-50 border border-green-100";
        if (isWorstPrice(v)) return "bg-red-50 border border-red-100";
      }
    }
    if (rowKey === "rating") {
      const r = Number(it.rating ?? 0);
      if (isBestRating(r)) return "bg-green-50 border border-green-100";
      if (isWorstRating(r)) return "bg-red-50 border border-red-100";
    }
    return "";
  };

  return (
    <div className="w-full pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-center mt-12 mb-4">
          Compare Products
        </h1>
        <p className="text-center text-neutral-600 mb-8">
          Smart comparison — auto highlights and difference mode.
        </p>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={differencesOnly}
                onChange={(e) => setDifferencesOnly(e.target.checked)}
              />
              <span>Show only differences</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="px-3 py-2 rounded-md border">
              ← Back
            </button>
            <button
              onClick={() => openAddFlow()}
              className="px-3 py-2 rounded-md bg-[var(--green)] text-white"
            >
              + Add product
            </button>
          </div>
        </div>

        {/* MOBILE stacked cards */}
        <div className="md:hidden space-y-4">
          {selectedItems.map((it) => (
            <motion.div
              key={it.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-16 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={devPlaceholder(it.image)}
                    alt={it.title}
                    width={200}
                    height={140}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{it.title}</h3>
                    <button
                      onClick={() => removeItem(it.slug)}
                      className="text-sm text-neutral-500"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-sm text-neutral-600">
                    {it.price} · ⭐ {it.rating}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-neutral-500">Pros</div>
                  <ul className="text-sm text-neutral-700 mt-1">
                    <li>• Great build</li>
                    <li>• Solid rating</li>
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-neutral-500">Cons</div>
                  <ul className="text-sm text-neutral-700 mt-1">
                    <li>• Limited colors</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DESKTOP premium table */}
        <div className="hidden md:block">
          {/* Sticky header */}
          <div
            ref={headerRef}
            className="sticky top-28 z-40 bg-white/70 backdrop-blur-sm border-b shadow-sm"
          >
            <div className="max-w-7xl mx-auto">
              <div
                className="min-w-[900px] grid gap-8 py-4"
                style={{ gridTemplateColumns: `repeat(${selectedItems.length}, 1fr)` }}
              >
                {selectedItems.map((it, idx) => (
                  <div
                    key={it.slug}
                    onMouseEnter={() => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                    className={`text-center p-3 rounded-md transition ${
                      hoverIndex === idx ? "scale-[1.02] shadow-lg" : ""
                    }`}
                  >
                    <div className="mx-auto w-44 h-36 rounded-lg overflow-hidden shadow-sm">
                      <Image
                        src={devPlaceholder(it.image)}
                        alt={it.title}
                        width={360}
                        height={260}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="mt-3">
                      <div className="font-semibold">{it.title}</div>
                      <div className="text-neutral-500 text-sm">{it.price}</div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="text-sm">⭐ {it.rating}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <button
                        onClick={() => removeItem(it.slug)}
                        className="text-sm text-neutral-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Body table */}
          <div ref={bodyRef} className="max-w-7xl mx-auto overflow-x-auto border-t">
            <table className="min-w-[900px] w-full border-collapse text-sm">
              <tbody>
                {rows.map((row, rIdx) => {
                  if (differencesOnly && !diffs[row.key]) return null;

                  return (
                    <tr
                      key={row.key}
                      className={`${rIdx % 2 === 0 ? "bg-white" : "bg-neutral-50"} ${
                        row.tall ? "align-top" : "align-middle"
                      }`}
                    >
                      <td className="sticky left-0 z-30 bg-white font-bold py-6 pr-6 w-48 text-center">
                        {row.label}
                      </td>

                      {selectedItems.map((it, idx) => {
                        const highlight =
                          row.key === "price" || row.key === "rating"
                            ? getHighlightClass(row.key, it)
                            : "";

                        return (
                          <td
                            key={it.slug}
                            onMouseEnter={() => setHoverIndex(idx)}
                            onMouseLeave={() => setHoverIndex(null)}
                            className={`py-6 text-center transition-all duration-200 ${highlight} ${
                              hoverIndex === idx ? "ring-1 ring-[var(--green)]/20 rounded-lg" : ""
                            }`}
                          >
                            <div className="max-w-[260px] mx-auto">{row.render(it)}</div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}