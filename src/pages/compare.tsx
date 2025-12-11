"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { items as allItems, Item } from "@/data/items";
import { devPlaceholder } from "@/utils/devPlaceholder";
import { useCompare } from "@/hooks/useCompare";

/* -----------------------------------------------------
   Helper utilities
----------------------------------------------------- */
function parsePrice(p?: string | number) {
  if (!p) return NaN;
  return Number(String(p).replace(/[^0-9.]/g, "")) || NaN;
}

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

/* =====================================================
   MAIN COMPONENT
===================================================== */
export default function ComparePage() {
  const router = useRouter();

  /* -----------------------------------------
     Zustand — SINGLE SOURCE OF TRUTH
     (Fixes misalignment issue completely)
  ----------------------------------------- */
  const compareSlugs = useCompare((s) => s.items);
  const remove = useCompare((s) => s.remove);

  /* -----------------------------------------
     Build selected items from Zustand
  ----------------------------------------- */
  const selectedItems = useMemo(
    () => allItems.filter((i) => compareSlugs.includes(i.slug)),
    [compareSlugs]
  );

  /* Redirect if empty */
  useEffect(() => {
    if (compareSlugs.length === 0) router.push("/");
  }, [compareSlugs, router]);

  /* -----------------------------------------
     Horizontal sync (header + body)
  ----------------------------------------- */
  const headerRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    const body = bodyRef.current;
    if (!header || !body) return;

    const sync = () => {
      header.scrollLeft = body.scrollLeft;
    };
    body.addEventListener("scroll", sync);
    return () => body.removeEventListener("scroll", sync);
  }, []);

  /* -----------------------------------------
     UI State
  ----------------------------------------- */
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [differencesOnly, setDifferencesOnly] = useState(false);

  /* -----------------------------------------
     Compute stats for highlights
  ----------------------------------------- */
  const stats = useMemo(() => {
    const prices = selectedItems.map((i) => parsePrice(i.price));
    const ratings = selectedItems.map((i) => Number(i.rating ?? 0));

    const validPrices = prices.filter((p) => !isNaN(p));
    const maxPrice = Math.max(...validPrices);
    const minPrice = Math.min(...validPrices);

    const maxRating = Math.max(...ratings);
    const minRating = Math.min(...ratings);

    return { prices, ratings, maxPrice, minPrice, maxRating, minRating };
  }, [selectedItems]);

  const isBestPrice = (p: number) => p === stats.minPrice;
  const isWorstPrice = (p: number) => p === stats.maxPrice;

  const isBestRating = (r: number) => r === stats.maxRating;
  const isWorstRating = (r: number) => r === stats.minRating;

  /* -----------------------------------------
     Row definitions
  ----------------------------------------- */
  const rows = useMemo(() => {
    return [
      {
        key: "price",
        label: "Price",
        render: (it: Item) => it.price ?? "—",
        value: (it: Item) => parsePrice(it.price),
      },
      {
        key: "rating",
        label: "Rating",
        render: (it: Item) => (
          <div className="flex flex-col items-center gap-2">
            <span className="font-medium">⭐ {it.rating}</span>
            <div className="w-28 h-2 bg-neutral-100 rounded overflow-hidden">
              <div
                className="h-full bg-[var(--green)]"
                style={{
                  width: `${clamp(((Number(it.rating ?? 0) / 5) * 100), 0, 100)}%`,
                }}
              />
            </div>
          </div>
        ),
        value: (it: Item) => Number(it.rating ?? 0),
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
      },
      {
        key: "availability",
        label: "Availability",
        render: () => "✓ In stock",
      },
      {
        key: "actions",
        label: "Actions",
        render: (it: Item) => (
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/${it.category.replace(/_/g, "-")}/${it.slug}`}
              className="px-4 py-2 rounded-lg border hover:bg-neutral-50 transition"
            >
              View
            </Link>
            <button
              className="px-3 py-1 rounded bg-neutral-100 hover:bg-neutral-200"
              onClick={() => remove(it.slug)}
            >
              Remove
            </button>
          </div>
        ),
      },
    ];
  }, [remove]);

  /* -----------------------------------------
     Differences-only logic
  ----------------------------------------- */
  const diffs = useMemo(() => {
    const out: Record<string, boolean> = {};

    rows.forEach((r) => {
      if (!r.value) return (out[r.key] = false);

      const vals = selectedItems.map((it) => r.value!(it));
      const distinct = new Set(vals.map((v) => String(v)));

      out[r.key] = distinct.size > 1;
    });

    return out;
  }, [rows, selectedItems]);

  /* -----------------------------------------
     Highlight style for best/worst values
  ----------------------------------------- */
  function getHighlightClass(rowKey: string, it: Item) {
    if (rowKey === "price") {
      const p = parsePrice(it.price);
      if (isBestPrice(p)) return "bg-green-50 border border-green-100";
      if (isWorstPrice(p)) return "bg-red-50 border border-red-100";
    }
    if (rowKey === "rating") {
      const r = Number(it.rating ?? 0);
      if (isBestRating(r)) return "bg-green-50 border border-green-100";
      if (isWorstRating(r)) return "bg-red-50 border border-red-100";
    }
    return "";
  }

  /* =====================================================
     RENDER
  ====================================================== */
  return (
    <div className="w-full pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mt-12 mb-4">
          Compare Products
        </h1>

        <p className="text-center text-neutral-600 mb-8 max-w-2xl mx-auto">
          Smart comparison with automatic highlights for best price and rating.
          Toggle “differences only” to focus on what really changes.
        </p>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={differencesOnly}
              onChange={(e) => setDifferencesOnly(e.target.checked)}
            />
            <span>Show only differences</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="px-3 py-2 rounded-md border"
            >
              ← Back
            </button>

            <button
              onClick={() => router.push("/categories")}
              className="px-4 py-2 rounded-md bg-[var(--green)] text-white"
            >
              + Add product
            </button>
          </div>
        </div>

        {/* DESKTOP TABLE */}
        {selectedItems.length > 0 && (
          <div className="hidden md:block">
            {/* Sticky header */}
            <div
              ref={headerRef}
              className="sticky top-28 z-40 bg-white/70 backdrop-blur-sm border-b shadow-sm"
            >
              <div className="max-w-7xl mx-auto">
                <div
                  className="grid gap-8 py-4 min-w-[900px]"
                  style={{
                    gridTemplateColumns: `repeat(${selectedItems.length}, 1fr)`,
                  }}
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
                          className="object-cover"
                        />
                      </div>

                      <div className="mt-3 font-semibold">{it.title}</div>
                      <div className="text-neutral-500 text-sm">{it.price}</div>

                      <button
                        className="mt-2 text-sm text-neutral-500 hover:text-red-500"
                        onClick={() => remove(it.slug)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Body */}
            <div ref={bodyRef} className="overflow-x-auto max-w-7xl mx-auto">
              <table className="min-w-[900px] w-full border-collapse text-sm">
                <tbody>
                  {rows.map((row, i) => {
                    if (differencesOnly && !diffs[row.key]) return null;

                    return (
                      <tr
                        key={row.key}
                        className={`${i % 2 ? "bg-neutral-50" : "bg-white"} ${
                          row.tall ? "align-top" : "align-middle"
                        }`}
                      >
                        <td className="sticky left-0 bg-white z-30 font-bold py-6 pr-6 w-48 text-center">
                          {row.label}
                        </td>

                        {selectedItems.map((it, idx) => (
                          <td
                            key={it.slug}
                            onMouseEnter={() => setHoverIndex(idx)}
                            onMouseLeave={() => setHoverIndex(null)}
                            className={`py-6 text-center transition-all duration-200 ${
                              getHighlightClass(row.key, it)
                            } ${hoverIndex === idx ? "ring-1 ring-green-300" : ""}`}
                          >
                            <div className="max-w-[260px] mx-auto">
                              {row.render(it)}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
