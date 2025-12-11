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

import TierLegend from "@/components/search/TierLegend";
import FilterPills from "@/components/search/FilterPills";
import { getTierIcon } from "@/lib/tierIcons";
import { searchItems } from "@/utils/searchEngine";
import { itemUrl } from "@/utils/urls";
import { devPlaceholder } from "@/utils/devPlaceholder";
import { SearchProvider } from "@/context/SearchContext";
import { getTier } from "@/lib/getTier";
import { priceGroup } from "@/utils/sorting";
import FilterDrawer from "@/components/search/FilterDrawer";

// ------------------------------
// Highlight Helper
function highlight(text: string, q: string) {
  if (!text || !q) return text || "";
  const regex = new RegExp(`(${q})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// ------------------------------
// Skeleton card
const CardSkeleton = () => {
  return (
    <div className="rounded-xl border bg-white p-4 animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200 rounded-lg" />
      <div className="h-4 bg-gray-200 rounded mt-3 w-3/4" />
      <div className="h-3 bg-gray-200 rounded mt-2 w-1/2" />
    </div>
  );
};

const formatCategory = (str: string) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
};

type Filters = {
  tier: string[];
  price: [number, number] | null;
  collection: string | null;
  sortBy: string;
};

// ------------------------------
// Main Search Page (with right drawer filters)
// ------------------------------
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qParam = searchParams.get("q") || "";
  const tierParam = searchParams.get("tier");
  const collectionParam = searchParams.get("collection");

  // UI state
  const [query, setQuery] = useState<string>(qParam || "");
  const [allResults, setAllResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filters, setFilters] = useState<Filters>({
    collection: null,
    price: [0, 9999],
    sortBy: "relevance",
    tier: [],
  });

  // Right drawer open state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Hydrate tier from URL (?tier=S,A,B)
  useEffect(() => {
    if (tierParam) {
      setFilters((prev) => ({
        ...prev,
        tier: tierParam.split(","),
      }));
    }
  }, [tierParam]);

  // Hydrate collection from URL (?collection=...)
  useEffect(() => {
    if (collectionParam) {
      setFilters((prev) => ({
        ...prev,
        collection: collectionParam,
      }));
    }
  }, [collectionParam]);

  // Keep tier synced back into the URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (Array.isArray(filters.tier) && filters.tier.length > 0) {
      params.set("tier", filters.tier.join(","));
    } else {
      params.delete("tier");
    }

    router.replace(`/search?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.tier]);

  // Pagination / infinite scroll
  const PER_PAGE = 12;
  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const toggleTier = (tier: string) => {
    setFilters((prev) => {
      const current = Array.isArray(prev.tier) ? prev.tier : [];
      const exists = current.includes(tier);
      return {
        ...prev,
        tier: exists
          ? current.filter((t: string) => t !== tier)
          : [...current, tier],
      };
    });
  };

  // Debounce URL updates as the user types
  const debouncedPush = useRef<number | null>(null);
  useEffect(() => {
    if (debouncedPush.current) window.clearTimeout(debouncedPush.current);
    debouncedPush.current = window.setTimeout(() => {
      const encoded = encodeURIComponent(query.trim());
      router.replace(`/search${encoded ? `?q=${encoded}` : ""}`, {
        scroll: false,
      });
    }, 300);

    return () => {
      if (debouncedPush.current) window.clearTimeout(debouncedPush.current);
    };
  }, [query, router]);

  // Run search whenever search params change
  useEffect(() => {
    async function runSearch() {
      setLoading(true);
      const q = searchParams.get("q") || query;
      try {
        const results = searchItems(q || "");
        setAllResults(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error("search error", err);
        setAllResults([]);
      } finally {
        setTimeout(() => setLoading(false), 250);
      }
    }

    runSearch();
    setPage(1);
  }, [searchParams, query]);

  // Helpers to clear filters
  const clearOne = useCallback((key: keyof Filters | "q") => {
    if (key === "q") {
      setQuery("");
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [key]:
        key === "sortBy"
          ? ("relevance" as Filters["sortBy"])
          : key === "tier"
          ? []
          : null,
    }));
    setPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setFilters({
      collection: null,
      price: null,
      sortBy: "relevance",
      tier: [],
    });
    setQuery("");
    setPage(1);
  }, []);

  // Apply filters + sorting
  const filtered = useMemo(() => {
    let arr = [...allResults];

    // Collection
    if (filters.collection) {
      arr = arr.filter((i) => i.category === filters.collection);
    }

    // Price group (if you later change price to buckets)
    if (filters.price && Array.isArray(filters.price)) {
      const [min, max] = filters.price;

      arr = arr.filter((item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        return price >= min && price <= max;
      });
    }

    // Tier multi-select
    if (filters.tier && filters.tier.length > 0) {
      arr = arr.filter((item) => filters.tier.includes(getTier(item)));
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

    // (Optional) Tier priority sort could go here if you want

    return arr;
  }, [allResults, filters]);

  // Slice for pagination
  const displayed = useMemo(
    () => filtered.slice(0, page * PER_PAGE),
    [filtered, page]
  );
  const hasMore = displayed.length < filtered.length;

  // Infinite scroll observer
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

  // Reset page when major filters change
  useEffect(() => {
    setPage(1);
  }, [filters.collection, filters.price, filters.sortBy]);

  // -------------------- RENDER --------------------
  return (
    <SearchProvider>
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        <h1 className="text-4xl font-bold mb-2">Search Results</h1>

        {/* Search input + Filter trigger (mobile & desktop) */}
        <div className="flex items-center gap-4 mb-2">
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
            onClick={() => setIsFilterDrawerOpen(true)}
            className="px-3 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50 shadow-sm"
            aria-label="Open filters"
          >
            Filters
          </button>
        </div>

        {/* Tier legend */}
        <TierLegend selectedTiers={filters.tier} onToggle={toggleTier} />

        {/* Active filter pills + result count + sort & filters button */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[220px]">
            <FilterPills
              query={query}
              category={filters.collection}
              priceRange={filters.price}
              onClear={(key) => clearOne(key as any)}
              onClearAll={clearAll}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-500">
              {filtered.length} item{filtered.length === 1 ? "" : "s"} found
            </span>

            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full border text-sm bg-white hover:bg-gray-50"
            >
              Filters
            </button>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
              className="border rounded-lg px-3 py-2 text-sm bg-white shadow-sm hover:border-black transition"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price_low">Price: Low → High</option>
              <option value="price_high">Price: High → Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* No results state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center mt-14 text-gray-500">
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="mb-6">
              Try adjusting or removing filters to improve results.
            </p>

            <div className="flex justify-center gap-3 flex-wrap mb-6">
              {filters.price && (
                <button
                  className="px-3 py-1 rounded-full border hover:bg-gray-100 transition text-sm"
                  onClick={() => clearOne("price")}
                >
                  Remove price filter
                </button>
              )}

              {filters.sortBy !== "relevance" && (
                <button
                  className="px-3 py-1 rounded-full border hover:bg-gray-100 transition text-sm"
                  onClick={() => clearOne("sortBy")}
                >
                  Reset sorting to relevance
                </button>
              )}

              <button
                onClick={clearAll}
                className="px-4 py-1 rounded-full bg-black text-white hover:opacity-80 transition text-sm"
              >
                Clear All Filters
              </button>
            </div>

            {query.length > 2 && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-3">
                  Related search ideas
                </h3>
                <div className="flex justify-center gap-3 flex-wrap text-sm">
                  {["premium", "budget", "latest", "top rated"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 rounded-full border hover:bg-gray-100"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results grid */}
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
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
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
                      transition-all duration-300 group relative overflow-hidden"
                    >
                      {/* Image */}
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 shadow-sm">
                        <Image
                          src={devPlaceholder(item.image)}
                          alt={item.title}
                          width={400}
                          height={300}
                          className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      {/* Title */}
                      <h3
                        className="mt-3 font-semibold text-base md:text-lg line-clamp-2 text-[var(--find7-color-primary)] transition-colors"
                        dangerouslySetInnerHTML={{
                          __html: highlight(
                            item.title,
                            searchParams.get("q") || query
                          ),
                        }}
                      />

                      {/* Description */}
                      <p className="mt-1 text-sm text-[var(--find7-color-neutral)] line-clamp-2">
                        {item.subtitle}
                      </p>

                      <div className="w-full h-[1px] bg-gray-100 my-3" />

                      {/* Tier badge */}
                      {tier && (
                        <span
                          className={`
                            inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-bold 
                            uppercase tracking-wide transition-all select-none shadow-sm
                            ${
                              tier === "S" &&
                              "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            }
                            ${
                              tier === "A" &&
                              "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                            }
                            ${
                              tier === "B" &&
                              "bg-gradient-to-r from-yellow-300 to-amber-300 text-black"
                            }
                            ${
                              tier === "C" &&
                              "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800"
                            }
                            group-hover:scale-[1.08]
                          `}
                          title={`This item is ranked Tier ${tier}`}
                        >
                          <span className="text-base">{getTierIcon(tier)}</span>
                          Tier {tier}
                        </span>
                      )}

                      {/* Rating + Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          ⭐{" "}
                          <span className="text-[13px] font-medium">
                            {item.rating}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">
                          {item.price}
                        </span>
                      </div>

                      {/* Category label */}
                      <div className="mt-2 text-xs font-medium text-[var(--green)] bg-[rgba(0,200,100,0.06)] px-2 py-1 rounded-full w-fit">
                        {formatCategory(item.category)}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} style={{ height: 1 }} />

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

      {/* Right-side filters drawer */}
      <FilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </SearchProvider>
  );
}
