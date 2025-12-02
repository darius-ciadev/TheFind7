"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import SearchResultsInfinite from "./SearchResultsInfinite";
import ActiveFilters from "./chips/ActiveFilters";
import { curatedCategories } from "@/data/items";
import { searchItems } from "@/utils/searchEngine";
import { priceGroup } from "@/utils/sorting";
import { Item } from "@/data/items";

/* ------------------------------------------------------ */
/*  Helper: URL Updater for Filters                       */
/* ------------------------------------------------------ */
const useParamUpdater = (params: URLSearchParams, router: any) => {
  const updateParam = (key: string, value: string | null) => {
    const p = new URLSearchParams(params.toString());

    if (value === null || value === "" || value === "null") {
      p.delete(key);
    } else {
      p.set(key, value);
    }

    router.push(`/search?${p.toString()}`);
  };

  const clearAllFilters = () => {
    const p = new URLSearchParams(params.toString());

    // Remove **all filter params**
    p.delete("collection");
    p.delete("tier");
    p.delete("price");
    p.delete("sortBy");

    // Keep the search query (q). Remove if you want:
    // p.delete("q");

    router.push(`/search?${p.toString()}`);
  };

  return { updateParam, clearAllFilters };
};

/* ------------------------------------------------------ */
/*    MAIN COMPONENT                                      */
/* ------------------------------------------------------ */

export default function SearchResults({
  ItemCard,
  isLoading,
  hasMore,
  onLoadMore,
}: {
  ItemCard: React.ComponentType<{ item: Item }>;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  const params = useSearchParams();
  const router = useRouter();

  /* ---------------------------- */
  /* Read URL parameters          */
  /* ---------------------------- */
  const q = params.get("q") || "";
  const selectedCollection = params.get("collection");
  const tierFilter = params.get("tier");
  const priceFilter = params.get("price");
  const sortBy = params.get("sortBy") || "relevance";

  /* ---------------------------- */
  /* URL Updaters                 */
  /* ---------------------------- */
  const { updateParam, clearAllFilters } = useParamUpdater(params, router);

  /* ---------------------------- */
  /* Run Search Engine            */
  /* ---------------------------- */
  const rawResults = useMemo(() => {
    if (!q.trim()) return [];
    return searchItems(q);
  }, [q]);

  /* ---------------------------- */
  /* FILTER: COLLECTION           */
  /* ---------------------------- */
  const byCollection = useMemo(() => {
    if (!selectedCollection) return rawResults;
    return rawResults.filter((i) => i.category === selectedCollection);
  }, [rawResults, selectedCollection]);

  /* ---------------------------- */
  /* FILTER: TIER                 */
  /* ---------------------------- */
  const byTier = useMemo(() => {
    if (!tierFilter) return byCollection;
    return byCollection.filter((i) => i.tier === tierFilter);
  }, [byCollection, tierFilter]);

  /* ---------------------------- */
  /* FILTER: PRICE (budget/mid/premium) */
  /* ---------------------------- */
  const byPrice = useMemo(() => {
    if (!priceFilter) return byTier;

    return byTier.filter((i) => priceGroup(i.price) === priceFilter);
  }, [byTier, priceFilter]);

  /* ---------------------------- */
  /* FINAL SORT                   */
  /* ---------------------------- */
  const finalResults = useMemo(() => {
    const arr = [...byPrice];

    if (sortBy === "price_low") {
      arr.sort(
        (a, b) =>
          parseFloat((a.price ?? "$0").replace("$", "")) -
          parseFloat((b.price ?? "$0").replace("$", ""))
      );
    }

    if (sortBy === "price_high") {
      arr.sort(
        (a, b) =>
          parseFloat((b.price ?? "$0").replace("$", "")) -
          parseFloat((a.price ?? "$0").replace("$", ""))
      );
    }

    if (sortBy === "rating") {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return arr;
  }, [byPrice, sortBy]);

  /* ------------------------------------------------------ */
  /* UI FUNCTIONS                                           */
  /* ------------------------------------------------------ */

  const setCollection = (key: string) => updateParam("collection", key);
  const clearCollection = () => updateParam("collection", null);
  const setTier = (t: string) => updateParam("tier", t);
  const clearTier = () => updateParam("tier", null);
  const setSort = (v: string) => updateParam("sortBy", v);
  const setPrice = (v: string) => updateParam("price", v); // "budget" | "mid" | "premium"
  const clearPrice = () => updateParam("price", null);

  /* ------------------------------------------------------ */
  /* FILTERS PASSED TO ActiveFilters                        */
  /* ------------------------------------------------------ */
  const filterState = {
    collection: selectedCollection,
    tier: tierFilter,
    price: priceFilter,
    sortBy: sortBy,
  };

  const clearOne = (key: string) => updateParam(key, null);

  /* ------------------------------------------------------ */
  /* RENDER                                                 */
  /* ------------------------------------------------------ */

  return (
    <main className="grid grid-cols-[260px_1fr] gap-6 pb-20 pt-4">
      {/* ---------------------------------- */}
      {/* SIDEBAR LEFT                       */}
      {/* ---------------------------------- */}
      <aside className="border rounded-xl bg-white p-4 space-y-6 shadow-sm">
        {/* COLLECTIONS */}
        <div>
          <h3 className="font-semibold mb-2">Collections</h3>

          {curatedCategories.map((cat) => (
            <button
              key={cat.key}
              className={`block w-full px-3 py-2 rounded-md border text-left text-sm mb-1
                ${
                  selectedCollection === cat.key
                    ? "bg-black text-white border-black"
                    : "bg-white hover:bg-gray-100"
                }`}
              onClick={() => setCollection(cat.key)}
            >
              {cat.label}
            </button>
          ))}

          {selectedCollection && (
            <button
              className="text-xs underline opacity-60 mt-1"
              onClick={clearCollection}
            >
              Clear Collection
            </button>
          )}
        </div>

        {/* TIER */}
        <div>
          <h3 className="font-semibold mb-2">Tier</h3>
          {["S", "A", "B", "C"].map((t) => (
            <button
              key={t}
              className={`block w-full px-3 py-1 rounded-md border text-sm mb-1
                ${
                  tierFilter === t
                    ? "bg-black text-white border-black"
                    : "bg-white hover:bg-gray-100"
                }`}
              onClick={() => setTier(t)}
            >
              Tier {t}
            </button>
          ))}

          {tierFilter && (
            <button
              className="text-xs underline opacity-60 mt-1"
              onClick={clearTier}
            >
              Clear Tier
            </button>
          )}
        </div>

        {/* PRICE GROUPS */}
        <div>
          <h3 className="font-semibold mb-2">Price</h3>

          {[
            { key: "budget", label: "Budget ($ - $$)" },
            { key: "mid", label: "Mid ($$ - $$$)" },
            { key: "premium", label: "Premium ($$$$)" },
          ].map((p) => (
            <button
              key={p.key}
              className={`block w-full px-3 py-1 rounded-md border text-sm mb-1
                ${
                  priceFilter === p.key
                    ? "bg-black text-white border-black"
                    : "bg-white hover:bg-gray-100"
                }`}
              onClick={() => setPrice(p.key)}
            >
              {p.label}
            </button>
          ))}

          {priceFilter && (
            <button
              className="text-xs underline opacity-60 mt-1"
              onClick={clearPrice}
            >
              Clear Price
            </button>
          )}
        </div>
      </aside>

      {/* ---------------------------------- */}
      {/* MAIN: RESULTS + FILTER PILLS       */}
      {/* ---------------------------------- */}
      <div>
        <ActiveFilters
          filters={filterState}
          onClearOne={clearOne}
          onClearAll={clearAllFilters}
        />

        <SearchResultsInfinite
          items={finalResults}
          ItemCard={ItemCard}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          filters={filterState}
        />
      </div>
    </main>
  );
}
