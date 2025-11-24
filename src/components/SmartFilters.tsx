"use client";

import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/**
 * SmartFilters — Compact Apple/Stripe Minimal Version
 */

type ItemRaw = {
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  image?: string;
  price: string;
  rating: number;
};

type Props = {
  items: ItemRaw[];
  onChange?: (filtered: ItemRaw[]) => void;
  categories?: string[];
};

const CATEGORY_LABEL_MAP: Record<string, string> = {
  best_overall: "Best Overall",
  best_value: "Best Value",
  best_premium: "Best Premium",
  best_for_kids: "Best for Kids",
  best_eco_choice: "Eco Choice",
  cool_kids_choice: "Cool Kids’ Choice",
  best_utility_pick: "Utility Pick",
};

function toHumanCategory(catId: string) {
  return CATEGORY_LABEL_MAP[catId] ?? catId.replace(/_/g, " ");
}

function parsePrice(price: unknown) {
  const raw = typeof price === "string" ? price : String(price ?? "");
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function SmartFilters({ items, onChange, categories }: Props) {
  // Store original items by slug
  const slugToOriginal = useMemo(() => {
    const m = new Map<string, ItemRaw>();
    items.forEach((it) => m.set(it.slug, it));
    return m;
  }, [items]);

  // Normalize prices
  const normalized = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        priceNum: parsePrice(it.price),
      })),
    [items]
  );

  const allPrices = normalized.map((i) => i.priceNum);
  const absoluteMin = allPrices.length ? Math.min(...allPrices) : 0;
  const absoluteMax = allPrices.length ? Math.max(...allPrices) : 1000;

  // Infer human categories if not provided
  const inferredCategories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => set.add(it.category));
    const ids = Array.from(set);

    const ordered = Object.keys(CATEGORY_LABEL_MAP)
      .filter((k) => ids.includes(k))
      .map((k) => CATEGORY_LABEL_MAP[k]);

    const rest = ids
      .map((id) => toHumanCategory(id))
      .filter((h) => !ordered.includes(h));

    return ["All", ...ordered, ...rest];
  }, [items]);

  const categoryOptions = categories?.length ? categories : inferredCategories;

  // Reverse map human label → category IDs
  const humanToIds = useMemo(() => {
    const m: Record<string, string[]> = {};
    Object.entries(CATEGORY_LABEL_MAP).forEach(([id, label]) => {
      if (!m[label]) m[label] = [];
      m[label].push(id);
    });

    categoryOptions.forEach((label) => {
      if (!m[label]) m[label] = [label];
    });

    return m;
  }, [categoryOptions]);

  // 💡 Compact UI = minimal padding, tight spacing, elegant alignment
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState([absoluteMin, absoluteMax]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPriceRange([absoluteMin, absoluteMax]);
  }, [absoluteMin, absoluteMax]);

  const deferredSearch = useDeferredValue(search);

  // Filtering logic (unchanged)
  const filtered = useMemo(() => {
    let out = normalized.slice();

    if (selectedCategory !== "All") {
      const allowed = humanToIds[selectedCategory] ?? [selectedCategory];
      out = out.filter(
        (it) =>
          allowed.includes(it.category) ||
          allowed.includes(toHumanCategory(it.category)) ||
          toHumanCategory(it.category) === selectedCategory
      );
    }

    if (selectedRating != null) out = out.filter((it) => it.rating >= selectedRating);

    out = out.filter((it) => it.priceNum >= priceRange[0] && it.priceNum <= priceRange[1]);

    const q = deferredSearch.trim().toLowerCase();
    if (q) {
      out = out.filter((it) => {
        const hay = `${it.title} ${it.subtitle ?? ""} ${it.slug}`.toLowerCase();
        return q.split(/\s+/).every((t) => hay.includes(t));
      });
    }

    const copy = out.slice();
    if (sortBy === "price-low-high") return copy.sort((a, b) => a.priceNum - b.priceNum);
    if (sortBy === "price-high-low") return copy.sort((a, b) => b.priceNum - a.priceNum);
    if (sortBy === "rating-high-low") return copy.sort((a, b) => b.rating - a.rating);

    return copy;
  }, [normalized, selectedCategory, selectedRating, priceRange, deferredSearch, sortBy, humanToIds]);

  // Emit results
  useEffect(() => {
    const mapped = filtered
      .map((f) => slugToOriginal.get(f.slug))
      .filter(Boolean) as ItemRaw[];

    const t = setTimeout(() => onChange?.(mapped), 80);
    return () => clearTimeout(t);
  }, [filtered, onChange, slugToOriginal]);

  const reset = useCallback(() => {
    setSelectedCategory("All");
    setSelectedRating(null);
    setSortBy("relevance");
    setPriceRange([absoluteMin, absoluteMax]);
    setSearch("");
  }, [absoluteMin, absoluteMax]);

  // ------------------------------------------
  //              COMPACT UI LAYOUT
  // ------------------------------------------

  return (
    <div className="w-full rounded-xl border bg-white px-4 py-4 shadow-sm space-y-3">

      {/* TOP ROW — Search, Category, Sort */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, subtitle, or slug…"
          className="flex-1 rounded-lg border px-3 py-2 text-sm bg-white placeholder:text-neutral-400"
        />

        <div className="flex gap-2">
          {/* Category */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px] h-[36px] text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] h-[36px] text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low-high">Price: Low → High</SelectItem>
              <SelectItem value="price-high-low">Price: High → Low</SelectItem>
              <SelectItem value="rating-high-low">Rating: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* RATING + RESET */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[{label:"Any",val:null},{label:"3+",val:3},{label:"4+",val:4},{label:"4.5+",val:4.5}].map((r) => {
            const active = selectedRating === r.val;
            return (
              <button
                key={r.label}
                onClick={() => setSelectedRating(r.val)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  active ? "bg-[var(--green)] text-white" : "bg-neutral-100 hover:bg-neutral-200"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <button
          onClick={reset}
          className="px-2 py-1 text-xs rounded-md bg-neutral-50 hover:bg-neutral-100"
        >
          Reset
        </button>

        <span className="text-xs text-neutral-600 w-20 text-right">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* PRICE BAR */}
      <div className="flex items-center justify-between text-xs text-neutral-700">
        <span>Price</span>
        <span>
          ${priceRange[0]} — ${priceRange[1]}
        </span>
      </div>

      <Slider
        value={priceRange}
        onValueChange={(v) => Array.isArray(v) && v.length === 2 && setPriceRange(v as number[])}
        min={absoluteMin}
        max={absoluteMax}
        step={1}
        className="mt-1"
      />
    </div>
  );
}
