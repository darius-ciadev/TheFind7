import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import Seo from "@/components/Seo";
import SmartFilters from "@/components/SmartFilters";
import ItemCard from "@/components/ItemCard";
import { categories } from "@/data/categories";
import { items, Item } from "@/data/items";

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
    <div className="rounded-lg border bg-white p-4 animate-pulse">
      <div className="bg-gray-200 h-44 rounded-md mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

/* Empty State */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="w-full rounded-xl border bg-white p-8 text-center">
      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="text-sm text-neutral-600 mb-4">
        Try removing filters or reset to see all curated picks.
      </p>
      <button
        onClick={onReset}
        className="inline-block px-4 py-2 rounded-md bg-[var(--green)] text-white font-medium"
      >
        Reset filters
      </button>
    </div>
  );
}

export default function CategoryPage({ category, categoryItems }: Props) {
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);

  // sorting persistence
  const [sortBy, setSortBy] = useState<string>("rating-desc");

  // filtered array
  const [filteredItems, setFilteredItems] = useState<Item[]>(categoryItems);

  // transition micro-state
  const [isFiltering, setIsFiltering] = useState(false);

  // skeleton during transitions
  useEffect(() => {
    setIsFiltering(true);
    const t = setTimeout(() => setIsFiltering(false), 200);
    return () => clearTimeout(t);
  }, [filteredItems.length]);

  // smooth scroll after filters
  useEffect(() => {
    if (!resultsRef.current || !filtersRef.current) return;
    requestAnimationFrame(() => {
      const rect = filtersRef.current!.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.bottom + 24,
        behavior: "smooth",
      });
    });
  }, [filteredItems.length]);

  // FILTER → update list
  const handleFiltersChange = useCallback((next: Item[]) => {
    setFilteredItems(next);
  }, []);

  /* SORT LOGIC */
  const sortedItems = useMemo(() => {
    let arr = [...filteredItems];

    switch (sortBy) {
      case "rating-desc":
        arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "rating-asc":
        arr.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
        break;
      case "price-asc":
        arr.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "price-desc":
        arr.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      default:
        break;
    }

    return arr;
  }, [filteredItems, sortBy]);

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

  return (
    <>
      <Seo
        title={`${category.name} — The Find 7`}
        description={category.description || `Curated picks for ${category.name}`}
      />

      <div className="container py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Breadcrumbs */}
        <nav className="text-sm text-neutral mb-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span className="text-black">{category.name}</span>
        </nav>

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-2">
            <span className="text-4xl">{category.emoji}</span>
            <span>{category.name}</span>
          </h1>
          {category.description && (
            <p className="text-neutral-600 max-w-3xl">{category.description}</p>
          )}
        </header>

        {/* Filters */}
        <div ref={filtersRef} className="mb-6">
          <div className="sticky top-20 z-30">
            <div className="max-w-7xl mx-auto px-6 space-y-4">
              <SmartFilters items={categoryItems} onChange={handleFiltersChange} />

              {/* Highlights + sort */}
              <div className="flex flex-wrap items-center gap-3">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="px-3 py-2 rounded-md bg-neutral-50 text-sm text-neutral-800"
                  >
                    <div className="font-medium">{h.label}</div>
                    <div className="text-xs text-neutral-500">{h.hint}</div>
                  </div>
                ))}

                {/* Sort control */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="ml-auto border px-3 py-2 rounded-md text-sm"
                >
                  <option value="rating-desc">Rating: High → Low</option>
                  <option value="rating-asc">Rating: Low → High</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
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

        {/* GRID FIX HERE */}
        <section ref={resultsRef as any} className="max-w-7xl mx-auto px-6">
          {isFiltering ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: sortedItems.length }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : totalResults === 0 ? (
            <div className="max-w-2xl mx-auto">
              <EmptyState onReset={() => setFilteredItems(categoryItems)} />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto"
              >
                {sortedItems.map((item, i) => (
                  <motion.article
                    key={item.slug}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <ItemCard
                      rank={i + 1}
                      title={item.title}
                      subtitle={item.subtitle}
                      image={item.image}
                      price={item.price}
                      rating={item.rating}
                      slug={item.slug}
                      category={category.key}
                    />
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </section>

        {/* CTA */}
        <div className="mt-12 max-w-7xl mx-auto px-6">
          <div className="rounded-xl bg-white p-8 border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold">Want curated picks delivered?</h3>
                <p className="text-neutral-600">
                  Get weekly shortlists — no spam.
                </p>
              </div>
              <Link href="/signup" className="inline-block">
                <div className="inline-block bg-[var(--green)] text-white px-6 py-3 rounded-lg shadow">
                  Get shortlists →
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* static paths */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = categories.map((c) => ({
    params: { category: c.key.replace(/_/g, "-") },
  }));
  return { paths, fallback: false };
};

/* static props */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryParam = params?.category as string;
  const realCategoryKey = categoryParam.replace(/-/g, "_");

  const category = categories.find((c) => c.key === realCategoryKey);
  if (!category) return { notFound: true };

  const categoryItems = items.filter((i) => i.category === realCategoryKey);

  return {
    props: { category, categoryItems },
    revalidate: 3600,
  };
};