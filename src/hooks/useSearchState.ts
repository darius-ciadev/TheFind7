import { useState, useEffect } from "react";

// Define the types for each piece of state
interface SearchState {
  q: string;
  category: string | null;
  priceRange: [number, number] | null;
  sort: string;
  tier: string | null;
}

export default function useSearchState() {
  const [q, setQ] = useState<string>("");
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [sort, setSort] = useState<string>("relevance");
  const [tier, setTier] = useState<string | null>(null); // New state for tier

  // ------------------------------------------------------
  // URL SYNC
  // ------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (q) params.set("q", q);
    else params.delete("q");

    if (category) params.set("category", category);
    else params.delete("category");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    if (priceRange) params.set("price", `${priceRange[0]}-${priceRange[1]}`);
    else params.delete("price");

    if (tier) params.set("tier", tier);
    else params.delete("tier");

    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
  }, [q, category, sort, priceRange, tier]); // Make sure to include 'tier'

  // ------------------------------------------------------
  // INITIAL LOAD FROM URL
  // ------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const q0 = params.get("q") ?? "";
    const category0 = params.get("category");
    const sort0 = params.get("sort") ?? "relevance";
    const p = params.get("price");
    const tier0 = params.get("tier"); // Added handling for 'tier' param

    setQ(q0);
    setSort(sort0);

    if (category0) setCategory(category0);
    if (tier0) setTier(tier0); // Set 'tier' state

    if (p) {
      const [a, b] = p.split("-").map(Number);
      if (!Number.isNaN(a) && !Number.isNaN(b)) setPriceRange([a, b]);
    }
  }, []);

  // ------------------------------------------------------
  // RETURN FULL SEARCH STATE
  // ------------------------------------------------------
  return {
    q,
    setQ,
    category,
    setCategory,
    priceRange,
    setPriceRange,
    sort,
    setSort,
    tier,
    setTier, // Include 'setTier' for updating tier state
  };
}
