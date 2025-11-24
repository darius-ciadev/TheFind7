import React, { useEffect, useRef, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { categories } from "@/data/categories";
import { items, Item } from "@/data/items";
import SmartFilters from "@/components/SmartFilters";
import ItemCard from "@/components/ItemCard";

type Props = {
  category: {
    key: string;
    name: string;
    slug: string;
    emoji: string;
    description: string;
  };
  categoryItems: Item[];
};

// Small helper: build JSON-LD ItemList for SEO
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

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-white p-4 animate-pulse">
      <div className="bg-gray-200 h-44 rounded-md mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

export default function CategoryPage({ category, categoryItems }: Props) {
  // filteredItems will be driven exclusively by SmartFilters
  const [filteredItems, setFilteredItems] = useState<Item[]>(categoryItems);
  const resultsRef = useRef<HTMLElement | null>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // When SmartFilters emits, we briefly show a lightweight transition state
   useEffect(() => {
    // Only show skeleton when SmartFilters emits new results
    setIsFiltering(true);

    const t = setTimeout(() => {
        setIsFiltering(false);
    }, 250);

    return () => clearTimeout(t);
   }, [filteredItems.length]);


  // Auto-scroll to results after filtering (only when results exist)
  useEffect(() => {
    if (!resultsRef.current || !filtersRef.current) return;

    // compute position just below the filters container
    const filterRect = filtersRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + filterRect.bottom + 12; // 12px padding

    window.scrollTo({ top: scrollTop, behavior: "smooth" });
  }, [filteredItems]);

  // Build JSON-LD for SEO
  const categoryUrl = typeof window !== "undefined" ? window.location.href : `https://example.com/${category.slug}`;
  const jsonLd = buildItemListJsonLd(categoryUrl, filteredItems.slice(0, 50));

  return (
    <div className="container py-12">
      {/* JSON-LD injected for crawlers */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumbs */}
      <nav className="text-sm text-neutral mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        {" / "}
        <span className="text-black">{category.name}</span>
      </nav>

      {/* Category Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-3">
          <span className="text-4xl">{category.emoji}</span>
          {category.name}
        </h1>
        <p className="text-neutral text-lg max-w-2xl">{category.description}</p>
      </header>

      {/* Sticky filter + quick-actions area */}
      <div ref={filtersRef} className="mb-6">
        <div className="relative">
          <div className="sticky top-20 z-40">{/* top offset matches header/nav heights */}
            <div className="mx-0 md:mx-0">
              <SmartFilters
                items={categoryItems}
                onChange={(next: Item[]) => setFilteredItems(next)}
              />

              {/* Quick filters row (Editors picks, Trending, New) */}
              <div className="mt-3 flex flex-wrap gap-3">
                <QuickFilterButton label="Editor’s picks" onClick={() => {
                  // quick client-side filter: example = top 3 by rank
                  setFilteredItems(categoryItems.slice(0, 3));
                }} />

                <QuickFilterButton label="Trending" onClick={() => {
                  // trending = top rated sorted
                  const copy = [...categoryItems].sort((a,b)=> b.rating - a.rating);
                  setFilteredItems(copy.slice(0, 7));
                }} />

                <QuickFilterButton label="New arrivals" onClick={() => {
                  // assume later slugs or sort by price high as a proxy for new (example)
                  const copy = [...categoryItems].sort((a,b)=> parseFloat(b.slug.split("-")[1]) - parseFloat(a.slug.split("-")[1]));
                  setFilteredItems(copy);
                }} />

                <QuickFilterButton label="Reset" variant="muted" onClick={() => setFilteredItems(categoryItems)} />

                <div className="ml-auto text-sm text-neutral-600 self-center">Showing <strong>{filteredItems.length}</strong> result{filteredItems.length !== 1 ? "s" : ""}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results summary (compact) */}
      <ResultsSummary total={filteredItems.length} />

      {/* Animated Grid */}
      <section ref={resultsRef as any} className="mt-6">
        {isFiltering ? (
          // show skeleton grid while the filtering micro-animation plays
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item, i) => (
                <motion.article
                  layout
                  key={item.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <div className="relative">
                    <Link href={`/${category.slug}/${item.slug}`}>
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
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>

      {/* CTA / Newsletter block (matching your design) */}
      <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-green-50 to-white border">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Want curated picks delivered?</h3>
            <p className="text-neutral-700">Get expert-picked shortlists and weekly recommendations — no spam, just value.</p>
          </div>
          <Link href="/signup">
            <div className="inline-block bg-[var(--green)] text-white px-6 py-3 rounded-lg shadow">Get shortlists →</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------------------------
// Small inline subcomponents
// ---------------------------
function QuickFilterButton({ label, onClick, variant = "solid" }: { label: string; onClick: () => void; variant?: "solid" | "muted" }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium transition ${variant === "solid" ? "bg-[var(--green)] text-white" : "bg-neutral-100 text-neutral-800"}`}
    >
      {label}
    </button>
  );
}

function ResultsSummary({ total }: { total: number }) {
  return (
    <div className="mt-4 mb-3 flex items-center justify-between">
      <div className="text-sm text-neutral-700">Showing <strong>{total}</strong> result{total !== 1 ? "s" : ""}</div>
      <div className="text-sm text-neutral-600">Best picks curated for you</div>
    </div>
  );
}

/* ----------------------------------------------------
   STATIC PATHS & PROPS
---------------------------------------------------- */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = categories.map((c) => ({ params: { category: c.key.replace(/_/g, "-") } }));
  return { paths, fallback: false };
};

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
