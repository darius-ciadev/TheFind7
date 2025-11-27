"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import Seo from "@/components/Seo";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import CategoryCard from "@/components/CategoryCard";
import ItemCard from "@/components/ItemCard";
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
      <div className="py-16 bg-white">
        <ValueProps />
      </div>

      {/* -------------------------------------------------- */}
      {/* CATEGORY GRID */}
      {/* -------------------------------------------------- */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Browse Categories
            </h2>
            <p className="text-neutral mt-3 max-w-xl mx-auto">
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

      {/* -------------------------------------------------- */}
      {/* TOP PICKS (Carousel) */}
      {/* -------------------------------------------------- */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Top Picks of the Week
            </h2>

            <Link
              href="/categories"
              className="text-sm text-neutral hover:underline"
            >
              View all categories →
            </Link>
          </div>

          <TopPicksCarousel items={trending} />
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* FEATURED RESULTS */}
      {/* -------------------------------------------------- */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold">Featured results</h3>

            <span className="text-sm text-neutral">
              Showing {trending.length} recommendations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((it, idx) => (
              <ItemCard
                key={it.slug}
                rank={idx + 1}
                title={it.title}
                subtitle={it.subtitle ?? ''}
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

      {/* -------------------------------------------------- */}
      {/* CTA — ANIMATED */}
      {/* -------------------------------------------------- */}
      <section className="py-28 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={ref}
            className={`
              relative overflow-hidden rounded-2xl p-10 bg-white border shadow-sm
              flex flex-col md:flex-row md:items-center md:justify-between
              gap-12 md:gap-16
              transition-all duration-[900ms] ease-out
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
          >
            {/* Background glow */}
            <div
              className={`
                absolute inset-0 opacity-0 
                bg-[radial-gradient(circle_at_center,rgba(0,200,120,0.12),transparent)]
                transition-opacity duration-[1200ms]
                ${visible ? "opacity-100" : "opacity-0"}
              `}
            />

            {/* Text */}
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

            {/* CTA Button */}
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