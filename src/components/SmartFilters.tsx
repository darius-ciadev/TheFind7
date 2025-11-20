"use client";

import { useState, useMemo, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Item = {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  price: string; // "$199"
  rating: number;
};

type SmartFiltersProps = {
  items: Item[];
  categories: string[];
  onChange?: (filtered: Item[]) => void;
};

export default function SmartFilters({
  items,
  categories,
  onChange,
}: SmartFiltersProps) {
  // ----------------------------------------------------------
  // NORMALIZE ITEM PRICES ($199 → 199)
  // ----------------------------------------------------------
  const normalizedItems = useMemo(
    () =>
      items.map((i) => ({
        ...i,
        priceNum: parseFloat(i.price.replace(/[^0-9.]/g, "")) || 0,
      })),
    [items]
  );

  // ----------------------------------------------------------
  // PRICE RANGE LIMITS
  // ----------------------------------------------------------
  const allPrices = normalizedItems.map((i) => i.priceNum);
  const absoluteMin = Math.min(...allPrices);
  const absoluteMax = Math.max(...allPrices);

  const [priceRange, setPriceRange] = useState<number[]>([
    absoluteMin,
    absoluteMax,
  ]);

  // ----------------------------------------------------------
  // FILTER STATES
  // ----------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("relevance");

  // ----------------------------------------------------------
  // FILTER LOGIC
  // ----------------------------------------------------------
  const filtered = useMemo(() => {
    let result = [...normalizedItems];

    // Category Filter
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Rating Filter
    if (selectedRating) {
      result = result.filter((item) => item.rating >= selectedRating);
    }

    // Price Filter
    result = result.filter(
      (item) =>
        item.priceNum >= priceRange[0] && item.priceNum <= priceRange[1]
    );

    // Sort
    if (sortBy === "price-low-high") {
      result = result.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === "price-high-low") {
      result = result.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === "rating-high-low") {
      result = result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    normalizedItems,
    selectedCategory,
    selectedRating,
    priceRange,
    sortBy,
  ]);

  // Pass filtered items back to parent
  useEffect(() => {
    onChange?.(filtered);
  }, [filtered, onChange]);

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------
  return (
    <div className="w-full border rounded-2xl p-6 bg-white shadow-sm space-y-6">

      {/* CATEGORY + RATING */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Category Select */}
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rating Chips */}
        <div className="flex gap-2">
          {["Any", "3+", "4+", "4.5+"].map((label) => {
            const val =
              label === "Any" ? null : parseFloat(label.replace("+", ""));
            return (
              <button
                key={label}
                onClick={() => setSelectedRating(val)}
                className={cn(
                  "px-4 py-2 rounded-full border transition text-sm",
                  selectedRating === val
                    ? "bg-[var(--green)] text-white border-[var(--green)]"
                    : "bg-neutral-100 hover:bg-neutral-200"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRICE LABEL */}
      <div className="text-sm font-medium">Price</div>

      {/* PRICE SLIDER */}
      <div className="flex items-center gap-4">
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={absoluteMin}
          max={absoluteMax}
          step={1}
          className="w-full"
        />

        <div className="text-sm whitespace-nowrap">
          ${priceRange[0]} — ${priceRange[1]}
        </div>
      </div>

      {/* SORT SELECT */}
      <div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
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
  );
}
