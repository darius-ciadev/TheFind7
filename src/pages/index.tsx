"use client";

import { useState, useMemo, useDeferredValue } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Seo from "@/components/Seo";
import SmartFilters from "@/components/SmartFilters";
import ItemCard from "@/components/ItemCard";
import CategoryCard from "@/components/CategoryCard";
import ValueProps from "@/components/ValueProps";
import Hero from "@/components/Hero";
import { categories } from "@/data/categories";
import { items, Item } from "@/data/items";
import { useReveal } from "@/hooks/useReveal";

/* Lazy components */
const TopPicksCarousel = dynamic(
  () => import("@/components/TopPicksCarousel"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] bg-neutral-50 rounded-2xl animate-pulse" />
    ),
  }
);

export default function HomePage() {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const deferredItems = useDeferredValue(filteredItems);
  const { ref, visible } = useReveal();

  /* Trending fallback logic */
  const trending = useMemo(() => {
    const seen = new Set<string>();
    const picks: Item[] = [];

    for (const it of items) {
      if (!seen.has(it.category)) {
        seen.add(it.category);
        picks.push(it);
      }
      if (picks.length >= 6) break;
    }

    return picks.length ? picks : items.slice(0, 6);
  }, []);

  return (
    <>
      <Seo
        title="The Find 7 — Find the right one."
        description="We search, compare, and curate thousands of lists so you don’t have to. Seven ways to the right fit — every time."
      />

      {/* HERO (brand-correct) */}
      <Hero />

      {/* VALUE PROPS — Option A (tight, centered, polished) */}
      <ValueProps />

      {/* SMART FILTERS */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <SmartFilters
            items={items}
            categories={[
              "All",
              "Best Overall",
              "Best Value",
              "Best Premium",
              "Best for Kids",
              "Eco Choice",
              "Cool Kids’ Choice",
              "Utility Pick",
            ]}
            onChange={setFilteredItems}
          />
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Browse Categories
            </h2>
            <p className="text-neutral mt-2 max-w-xl mx-auto">
              Seven ways to the right choice — curated for every kind of shopper.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                slug={cat.slug}
                emoji={cat.emoji}
                tagline={cat.tagline}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TOP PICKS */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Top Picks of the Week
            </h2>
            <Link href="/categories" className="text-sm text-neutral hover:underline">
              View all categories →
            </Link>
          </div>

          <TopPicksCarousel
            items={
              filteredItems.length > 0
                ? deferredItems.slice(0, 12)
                : trending
            }
          />
        </div>
      </section>

      {/* FEATURED RESULTS */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Featured results</h3>
            <span className="text-sm text-neutral">
              Showing {deferredItems.length} result
              {deferredItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deferredItems.slice(0, 6).map((it, idx) => (
              <ItemCard
                key={it.slug}
                rank={idx + 1}
                title={it.title}
                subtitle={it.subtitle}
                image={it.image}
                price={it.price}
                rating={it.rating}
                slug={it.slug}
                category={it.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA — ANIMATED */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div
            ref={ref}
            className={`
              relative overflow-hidden rounded-2xl p-10 bg-white border shadow-sm
              flex flex-col md:flex-row md:items-center md:justify-between
              gap-10 md:gap-14
              transition-all duration-[900ms] ease-out
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
          >
            <div
              className={`
                absolute inset-0 opacity-0 
                bg-[radial-gradient(circle_at_center,rgba(0,200,120,0.12),transparent)]
                transition-opacity duration-[1200ms]
                ${visible ? "opacity-100" : "opacity-0"}
              `}
            />

            <div
              className={`
                relative z-[5] max-w-xl space-y-3
                transition-all duration-[1000ms] delay-[150ms]
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
            >
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Want curated picks delivered?
              </h3>

              <p className="text-neutral-600 text-base leading-relaxed">
                Get expert-picked shortlists and weekly recommendations — no spam,
                just value.
              </p>

              <div className="flex items-center gap-4 pt-2 text-neutral-500 text-sm">
                <span className="text-lg">🛡️</span> No spam ever
                <span className="text-lg">🔒</span> Unsubscribe anytime
              </div>
            </div>

            <Link
              href="/signup"
              className={`
                relative z-[5] inline-block px-8 py-4 rounded-xl
                bg-[var(--green)] text-white font-semibold shadow-md
                hover:bg-[var(--green-dark)] transition-all duration-300
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
            >
              Get shortlists →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
