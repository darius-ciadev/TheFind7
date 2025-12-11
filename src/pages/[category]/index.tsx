import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

import Seo from "@/components/Seo";
import SmartFilters from "@/components/SmartFilters";
import ItemCard from "@/components/ItemCard";
import { categories } from "@/data/categories";
import { items, Item } from "@/data/items";
import { slugToCategory, categoryToSlug } from "@/utils/urls";

type Props = {
  category: {
    key: string;
    name: string;
    slug: string;
    emoji: string;
    description?: string;
  };
  categoryItems: Item[];
};

/* JSON-LD builder */
function buildItemListJsonLd(categoryUrl: string, items: Item[]) {
  const itemListElements = items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${categoryUrl}/${it.slug}`,
    name: it.title,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Category list",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: itemListElements,
  };
}

/* Skeleton */
function SkeletonCard() {
  return (
    <div className="rounded-xl border">
      <div className="bg-gray-200 h-44 rounded-md mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

/* Empty State */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="w-full rounded-xl border">
      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="text-sm text-neutral-600 mb-4">
        Try removing filters or reset to see all curated picks.
      </p>
      <button
        onClick={onReset}
        className="inline-block px-4 py-2 rounded-md bg-[var(--green)] text-white font-medium hover:bg-[var(--green-dark)]"
      >
        Reset filters
      </button>
    </div>
  );
}

/* Sorting config */
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating-desc", label: "Rating: High → Low" },
  { value: "rating-asc", label: "Rating: Low → High" },
  { value: "most-popular", label: "Most Popular" },
  { value: "most-reviewed", label: "Most Reviewed" },
  { value: "newest", label: "Newest" },
] as const;

/* Smart sorting */
function sortProducts(products: Item[], sort: string) {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)
      );
    case "rating-desc":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "rating-asc":
      return sorted.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    case "most-popular":
      return sorted.sort(
        (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
      );
    case "most-reviewed":
      return sorted.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    case "recommended":
    default:
      return sorted.sort((a, b) => {
        const score = (p: Item) =>
          (p.rating ?? 0) * 3 +
          (p.reviews ?? 0) * 0.05 +
          (p.popularity ?? 0) * 0.02 -
          (Number(p.price) || 0) * 0.001;
        return score(b) - score(a);
      });
  }
}

export default function CategoryPage({ category, categoryItems }: Props) {
  const router = useRouter();
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);

  const [sortBy, setSortBy] = useState<string>("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filteredItems, setFilteredItems] =
    useState<Item[]>(categoryItems);

  const [isFiltering, setIsFiltering] = useState(false);

  /* Infinite Scroll */
  const [visibleCount, setVisibleCount] = useState(9);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* Apply initial URL params */
  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;

    if (typeof q.sort === "string") setSortBy(q.sort);
    if (q.view === "list" || q.view === "grid") setViewMode(q.view);
  }, [router.isReady]);

  /* Write sort/view to URL */
  useEffect(() => {
    if (!router.isReady) return;

    const next = { ...router.query, sort: sortBy, view: viewMode };

    router.replace(
      { pathname: router.pathname, query: next },
      undefined,
      { shallow: true }
    );
  }, [sortBy, viewMode, router.isReady]);

  /* Skeleton when filtering */
  useEffect(() => {
    setIsFiltering(true);
    const t = setTimeout(() => setIsFiltering(false), 200);
    return () => clearTimeout(t);
  }, [filteredItems.length, sortBy, viewMode]);

  /* Smooth scroll after filters */
  useEffect(() => {
    if (!filtersRef.current || !resultsRef.current) return;

    requestAnimationFrame(() => {
      const rect = filtersRef.current!.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.bottom + 24,
        behavior: "smooth",
      });
    });
  }, [filteredItems.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router.asPath]);

  /* Filter handler */
  const handleFiltersChange = useCallback((next: Item[]) => {
    setFilteredItems(next);
    setVisibleCount(9);
  }, []);

  /* Sorting */
  const sortedItems = useMemo(
    () => sortProducts(filteredItems, sortBy),
    [filteredItems, sortBy]
  );

  /* Infinite Scroll Observer (Netflix style) */
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount((prev) => {
            const next = prev + 6;
            return next > sortedItems.length ? sortedItems.length : next;
          });
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [sortedItems.length]);

  const visibleItems = sortedItems.slice(0, visibleCount);
  const totalResults = sortedItems.length;

  const categoryUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://example.com/${category.slug}`;

  const jsonLd = buildItemListJsonLd(categoryUrl, sortedItems.slice(0, 50));

  const highlights = [
    { label: "Best Overall", hint: "Top balanced picks" },
    { label: "Best Value", hint: "Great performance per $" },
    { label: "Premium", hint: "High-end options" },
  ];

  /* View Toggle */
  function ViewToggle() {
    return (
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => setViewMode("grid")}
          className={`
            p-2 rounded-lg border
            transition-all
            ${
              viewMode === "grid"
                ? "bg-[var(--green)] text-white shadow-[0_3px_12px_rgba(0,0,0,0.18)]"
                : "bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.12)]"
            }
          `}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75h7.5v7.5h-7.5zm0 9h7.5v7.5h-7.5zm9-9h7.5v7.5h-7.5zm0 9h7.5v7.5h-7.5z"
            />
          </svg>
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`
            p-2 rounded-lg border
            transition-all
            ${
              viewMode === "list"
                ? "bg-[var(--green)] text-white shadow-[0_3px_12px_rgba(0,0,0,0.18)]"
                : "bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.12)]"
            }
          `}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    );
  }

  /* Sort Select */
  function SortSelect() {
    return (
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="
            border rounded-lg px-3 py-2 text-sm bg-white
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)]
            hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.12)]
            transition-all
            appearance-none pr-8
          "
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600">
          ▼
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${category.name} — The Find 7`}
        description={
          category.description || `Curated picks for ${category.name}`
        }
      />

      <div className="container py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumbs */}
        <nav className="text-sm text-neutral mb-6">
          <Link href="/">Home</Link> / {" "}
          <span className="text-black">{category.name}</span>
        </nav>

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-2">
            <span className="text-4xl">{category.emoji}</span>
            <span>{category.name}</span>
          </h1>

          {category.description && (
            <p className="text-neutral-600 max-w-3xl">
              {category.description}
            </p>
          )}
        </header>

        {/* Filters */}
        <div ref={filtersRef} className="mb-6">
          <div className="sticky top-20 z-30">
            <div className="max-w-7xl mx-auto px-6 space-y-4 py-2">
              <SmartFilters
                items={categoryItems}
                onChange={handleFiltersChange}
              />

              {/* Highlights + Sort + Toggle */}
              <div className="flex flex-wrap items-center gap-3">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="
                      px-4 py-3 rounded-xl
                      bg-white shadow-[0_3px_12px_rgba(0,0,0,0.06)]
                      text-sm text-neutral-800
                    "
                  >
                    <div className="font-medium">{h.label}</div>
                    <div className="text-xs text-neutral-500">
                      {h.hint}
                    </div>
                  </div>
                ))}

                <div className="flex items-center ml-auto gap-3">
                  <SortSelect />
                  <ViewToggle />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="max-w-7xl mx-auto px-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-700">
              Curated picks — updated regularly
            </div>
            <div className="text-sm text-neutral-600">
              {totalResults} result{totalResults !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* GRID / LIST + Infinite Scroll */}
        <section ref={resultsRef} className="max-w-7xl mx-auto px-6">
          {isFiltering ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : totalResults === 0 ? (
            <div className="max-w-2xl mx-auto">
              <EmptyState
                onReset={() => {
                  setFilteredItems(categoryItems);
                  setVisibleCount(9);
                }}
              />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {viewMode === "grid" ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {visibleItems.map((item, i) => (
                    <motion.article
                      key={item.slug}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ItemCard
                        viewMode="grid"
                        rank={i + 1}
                        title={item.title}
                        subtitle={item.subtitle ?? ''}
                        image={item.image}
                        price={item.price}
                        rating={item.rating}
                        slug={item.slug}
                        category={category.key}
                      />
                    </motion.article>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col divide-y">
                  {visibleItems.map((item, i) => (
                    <motion.article
                      key={item.slug}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="py-4"
                    >
                      <ItemCard
                        viewMode="list"
                        rank={i + 1}
                        title={item.title}
                        subtitle={item.subtitle ?? ''}
                        image={item.image}
                        price={item.price}
                        rating={item.rating}
                        slug={item.slug}
                        category={category.key}
                      />
                    </motion.article>
                  ))}
                </div>
              )}

              {/* Infinite Scroll Loader */}
              {visibleCount < totalResults && (
                <div ref={loaderRef} className="w-full flex justify-center py-10">
                  <div className="animate-spin h-6 w-6 border-2 border-neutral-400 border-t-transparent rounded-full" />
                </div>
              )}

              {/* End of Results */}
              {visibleCount >= totalResults && (
                <div className="text-center text-sm text-neutral-500 py-8">
                  You’ve reached the end.
                </div>
              )}

            </AnimatePresence>
          )}
        </section>
      </div>
    </>
  );
}

/* static paths */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: categories.map((c) => ({
      params: { category: categoryToSlug(c.key) },
    })),
    fallback: false,
  };
};

/* static props */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryParam = params?.category as string;
  const realCategoryKey = categoryParam.replace(/-/g, "_");

  const category = categories.find((c) => c.key === realCategoryKey);
  if (!category) return { notFound: true };

  const categoryItems = items.filter(
    (i) => i.category === realCategoryKey
  );

  return {
    props: { category, categoryItems },
    revalidate: 3600,
  };
};