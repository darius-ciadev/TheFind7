import { useState, useEffect } from "react";

export type PriceFilter = "budget" | "mid" | "premium" | null;

interface SearchState {
  q: string;
  collection: string | null;     // curated group
  price: PriceFilter;             // budget/mid/premium
  sort: string;
  tier: string[];                 // MULTI SELECT
}

export default function useSearchState() {
  const [q, setQ] = useState<string>("");
  const [collection, setCollection] = useState<string | null>(null);
  const [price, setPrice] = useState<PriceFilter>(null);
  const [sort, setSort] = useState<string>("relevance");
  const [tier, setTier] = useState<string[]>([]); // <-- FIXED

  // ------------------------------------------------------
  // WRITE FILTERS → URL
  // ------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (collection) params.set("collection", collection);
    if (price) params.set("price", price);
    if (sort) params.set("sort", sort);
    if (tier.length > 0) params.set("tier", tier.join(",")); // multi

    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", url);
  }, [q, collection, price, sort, tier]);

  // ------------------------------------------------------
  // READ FROM URL → filter state
  // ------------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const q0 = params.get("q") ?? "";
    const col0 = params.get("collection") ?? null;

    const price0 = params.get("price") as PriceFilter | null;

    const sort0 = params.get("sort") ?? "relevance";

    const tierStr = params.get("tier");
    const tier0 = tierStr ? tierStr.split(",") : [];

    setQ(q0);
    setCollection(col0);
    setPrice(price0);
    setSort(sort0);
    setTier(tier0);
  }, []);

  // ------------------------------------------------------
  // Return everything
  // ------------------------------------------------------
  return {
    q,
    setQ,
    collection,
    setCollection,
    price,
    setPrice,
    sort,
    setSort,
    tier,
    setTier,
  };
}