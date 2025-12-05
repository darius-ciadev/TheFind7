"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import Seo from "@/components/Seo";
import Hero from "@/components/Hero";
import CTA from "@/components/CTA";
import ValueProps from "@/components/ValueProps";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/categories";
import { items } from "@/data/items";
import { useReveal } from "@/hooks/useReveal";

/* Lazy-loaded carousel */
const TopPicksCarousel = dynamic(
  () => import("@/components/TopPicksCarousel"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] bg-neutral-50 rounded-2xl animate-pulse" />
    ),
  }
);

import WhySeven from "@/components/WhySeven";

export default function HomePage() {
  const { ref, visible } = useReveal();

  /* Trending fallback logic */
  const trending = useMemo(() => {
    const seen = new Set<string>();
    const picks: typeof items = [];

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

      {/* -------------------------------------------------- */}
      {/* HERO */}
      {/* -------------------------------------------------- */}
      <Hero />

      {/* -------------------------------------------------- */}
      {/* VALUE PROPS */}
      {/* -------------------------------------------------- */}
      <ValueProps />

      {/* -------------------------------------------------- */}
      {/* CATEGORY GRID */}
      {/* -------------------------------------------------- */}
      <section id="browse-categories" className="py-20 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--find7-color-primary)] tracking-tight">
              Browse Categories
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-[var(--find7-color-neutral)]">
              Seven ways to the right choice — curated for every kind of
              shopper.
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

      {/* -------------------------------------------------- */}
      {/* TOP PICKS (Carousel) */}
      {/* -------------------------------------------------- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--find7-color-primary)]">
              Top Picks of the Week
            </h2>

            <Link
              href="/categories"
              className="text-sm text-[var(--find7-color-neutral)] hover:underline"
            >
              View all categories →
            </Link>
          </div>

          <TopPicksCarousel items={trending} />
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* WHY 7 — Brand Story Section */}
      {/* -------------------------------------------------- */}
      <WhySeven />

      {/* -------------------------------------------------- */}
      {/* CTA — ANIMATED */}
      {/* -------------------------------------------------- */}
      <CTA ref={ref} visible={visible} />
    </>
  );
}
