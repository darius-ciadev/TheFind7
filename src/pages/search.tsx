"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import SearchFilters from "@/components/search/SearchFilters";
import FilterPills from "@/components/search/FilterPills";
import { getTierIcon } from "@/lib/tierIcons";

import { searchItems } from "@/utils/searchEngine";
import { itemUrl } from "@/utils/urls";
import { devPlaceholder } from "@/utils/devPlaceholder";
import { SearchProvider } from "@/context/SearchContext";
import { getTier } from "@/lib/getTier";

// ------------------------------
// Highlight Helper (keeps your original)
function highlight(text: string, q: string) {
  if (!text || !q) return text || "";
  const regex = new RegExp(`(${q})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// ------------------------------
// Skeleton card for loading polish
function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-4 animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg" />
      <div className="h-4 bg-gray-200 rounded mt-3 w-3/4" />
      <div className="h-3 bg-gray-200 rounded mt-2 w-1/2" />
    </div>
  );
}

// ------------------------------
// Main Search Page (V3 UI)
// ------------------------------
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";

  // UI state
  const [query, setQuery] = useState<string>(qParam || "");
  const [allResults, setAllResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tierFilter, setTierFilter] = useState<string | null>(null);

  // filters object expected by SearchFilters in your current project
  const [filters, setFilters] = useState<any>({
    category: null,
    price: null,
    sortBy: "relevance",
  });

  // Pagination / infinite scroll (client-side slice)
  const PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // mobile filter drawer
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Debounce the live search to avoid extremely frequent router changes
  const debouncedPush = useRef<number | null>(null);
  useEffect(() => {
    // push shallow route update with debounce
    if (debouncedPush.current) window.clearTimeout(debouncedPush.current);
    debouncedPush.current = window.setTimeout(() => {
      const encoded = encodeURIComponent(query.trim());
      router.replace(`/search${encoded ? `?q=${encoded}` : ""}`);
    }, 300); // 300ms debounce
    return () => {
      if (debouncedPush.current) window.clearTimeout(debouncedPush.current);
    };
  }, [query, router]);

  // Run search when url q param changes OR filters update
  useEffect(() => {
    async function runSearch() {
      setLoading(true);
      // Use your existing searchItems utility (assumed to return relevance-sorted array)
      // provide the query string that lives in url (router.query) for canonical results
      const q = searchParams.get("q") || query;
      try {
        const results = searchItems(q || "");
        setAllResults(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error("search error", err);
        setAllResults([]);
      } finally {
        // small delay to make skeleton visible for very fast ops
        setTimeout(() => setLoading(false), 250);
      }
    }
    runSearch();
    // reset page when a new query or filters are applied
    setPage(1);
  }, [searchParams]);

  // helper to clear one filter
  const clearOne = useCallback((key: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: key === "sortBy" ? "relevance" : null,
    }));
    setPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setFilters({
      category: null,
      price: null,
      sortBy: "relevance",
    });
    setPage(1);
  }, []);

  // price group helper (keeps your original)
  function priceGroup(priceStr: string) {
    if (!priceStr) return null;
    const p = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    if (p < 70) return "budget";
    if (p < 150) return "mid";
    return "premium";
  }

  // Apply filters + sorting (memoized)
  const filtered = useMemo(() => {
    let arr = [...allResults];

    // Category
    if (filters.category) {
      arr = arr.filter((i) => i.category === filters.category);
    }

    // Price
    if (filters.price) {
      arr = arr.filter((i) => priceGroup(i.price) === filters.price);
    }

    // Sorting
    if (filters.sortBy === "price_low") {
      arr.sort(
        (a, b) =>
          parseFloat(a.price?.replace(/[^0-9.]/g, "") || "0") -
          parseFloat(b.price?.replace(/[^0-9.]/g, "") || "0")
      );
    } else if (filters.sortBy === "price_high") {
      arr.sort(
        (a, b) =>
          parseFloat(b.price?.replace(/[^0-9.]/g, "") || "0") -
          parseFloat(a.price?.replace(/[^0-9.]/g, "") || "0")
      );
    } else if (filters.sortBy === "rating") {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    // relevance assumed handled by searchItems

    return arr;
  }, [allResults, filters]);

  // slice for pagination (client-side)
  const displayed = useMemo(() => {
    return filtered.slice(0, page * PER_PAGE);
  }, [filtered, page]);

  const hasMore = displayed.length < filtered.length;

  // infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPage((p) => p + 1);
          }
        }
      },
      { rootMargin: "400px" }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore]);

  // when filters change from child SearchFilters, reset page
  useEffect(() => {
    setPage(1);
  }, [filters.category, filters.price, filters.sortBy]);

  // -------------------- RENDER --------------------
  return (
    <SearchProvider>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Search Results</h1>

        {/* search input + mobile filter toggle */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              placeholder="Search products, brands, categories..."
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 text-lg focus:ring-2 focus:ring-[var(--green)] outline-none"
            />
          </div>

          <button
            onClick={() => setShowFiltersMobile(true)}
            className="md:hidden px-3 py-2 border rounded-lg"
            aria-label="Open filters"
          >
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar / filters */}
          <div className="hidden md:block md:sticky top-24 h-fit">
            <SearchFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Mobile drawer */}
          {showFiltersMobile && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowFiltersMobile(false)}
              />
              <div className="absolute right-0 top-0 bottom-0 w-4/5 bg-white p-4 overflow-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Filters</h3>
                  <button
                    className="text-sm"
                    onClick={() => setShowFiltersMobile(false)}
                  >
                    Close
                  </button>
                </div>
                <SearchFilters filters={filters} setFilters={setFilters} />
              </div>
            </div>
          )}

          {/* Results */}
          <div>
            {/* active filters + result count + SORTING DROPDOWN (Upgrade E) */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[200px]">
                <FilterPills
                  query={query}
                  category={filters.category}
                  priceRange={filters.price}
                  onClear={(key) => {
                    if (key === "q") setQuery("");
                    if (key === "category") clearOne("category");
                    if (key === "price") clearOne("price");
                  }}
                  onClearAll={() => {
                    setQuery("");
                    clearAll();
                  }}
                />
              </div>

              {/* Result count */}
              <div className="text-sm text-gray-500">
                {filtered.length} item{filtered.length === 1 ? "" : "s"} found
              </div>

              {/* 🔥 Sorting Dropdown — Upgrade E */}
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm hover:border-black transition"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price_low">Price: Low → High</option>
                <option value="price_high">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* No results */}
            {!loading && filtered.length === 0 && (
              <div className="text-center mt-14 text-gray-500">
                <h2 className="text-xl font-semibold mb-2">No results found</h2>
                <p className="mb-6">
                  Try adjusting or removing filters to improve results.
                </p>

                <div className="flex justify-center gap-3 flex-wrap">
                  {/* → Suggest clearing 1 filter at a time */}
                  {filters.category && (
                    <button
                      className="px-3 py-1 rounded-full border hover:bg-gray-100 transition"
                      onClick={() => clearOne("category")}
                    >
                      Remove category filter
                    </button>
                  )}

                  {filters.price && (
                    <button
                      className="px-3 py-1 rounded-full border hover:bg-gray-100 transition"
                      onClick={() => clearOne("price")}
                    >
                      Remove price filter
                    </button>
                  )}

                  {filters.sortBy !== "relevance" && (
                    <button
                      className="px-3 py-1 rounded-full border hover:bg-gray-100 transition"
                      onClick={() => clearOne("sortBy")}
                    >
                      Reset sorting to relevance
                    </button>
                  )}

                  {/* → Most powerful escape button */}
                  <button
                    onClick={clearAll}
                    className="px-4 py-1 rounded-full bg-black text-white hover:opacity-80 transition"
                  >
                    Clear All Filters
                  </button>
                </div>

                {/* Optional automatic suggestion keywords */}
                {query.length > 2 && (
                  <div className="mt-10">
                    <h3 className="text-md font-medium mb-3">
                      Related search ideas
                    </h3>
                    <div className="flex justify-center gap-3 flex-wrap">
                      {["premium", "budget", "latest", "top rated"].map(
                        (term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-3 py-1 rounded-full border hover:bg-gray-100"
                          >
                            {term}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {Array.from({ length: PER_PAGE }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
                  transition={{ duration: 0.25 }}
                >
                  {displayed.map((item: any, i) => {
                    const tier = getTier(item);

                    return (
                      <motion.div
                        key={item.slug || item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={itemUrl(item.category, item.slug)}
                          className="block rounded-xl border p-4 bg-white 
                          hover:shadow-xl hover:-translate-y-1 
                          transition-all duration-300 group"
                        >
                          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                            <Image
                              src={devPlaceholder(item.image)}
                              alt={item.title}
                              width={400}
                              height={300}
                              className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                            />
                          </div>

                          <h3
                            className="mt-3 font-semibold text-base md:text-lg line-clamp-2 group-hover:text-[var(--green)]"
                            dangerouslySetInnerHTML={{
                              __html: highlight(
                                item.title,
                                searchParams.get("q") || query
                              ),
                            }}
                          />

                          {/* Tier Badge — pulsing + premium glow */}
                          {tier && (
                            <span
                              className={`
                              inline-flex items-center gap-1 px-3 py-1 mt-2 rounded-md text-sm font-bold 
                              transition-all duration-300 select-none
                              ${
                                tier === "S" &&
                                "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_22px_rgba(193,88,255,0.95)] scale-[1.05]"
                              }
                              ${
                                tier === "A" &&
                                "bg-red-500 text-white shadow-[0_0_14px_rgba(255,60,60,0.7)]"
                              }
                              ${
                                tier === "B" &&
                                "bg-yellow-400 text-black shadow-[0_0_8px_rgba(255,234,50,0.6)]"
                              }
                              ${tier === "C" && "bg-gray-300 text-gray-700 shadow-sm"}
                              hover:scale-[1.07]
                            `}
                            >
                              {getTierIcon(tier)} Tier {tier}
                            </span>
                          )}

                          <p className="mt-1 text-sm opacity-70 capitalize">
                            {item.category}
                          </p>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* sentinel for infinite scroll */}
            <div ref={sentinelRef} style={{ height: 1 }} />

            {/* Loading more after initial load */}
            {hasMore && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-center text-sm text-gray-500"
              >
                Loading more results…
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
