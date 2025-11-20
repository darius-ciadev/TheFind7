// src/pages/index.tsx
import { useState } from "react";   
import Link from "next/link";
import Seo from "@/components/Seo";
import HeroCarousel from "@/components/HeroCarousel";
import SmartFilters from "@/components/SmartFilters";
import ItemCard from "@/components/ItemCard";
import { categories } from "@/data/categories";
import { items, Item } from "@/data/items";

/**
 * NOTE:
 * - The hero image path uses the uploaded file path:
 *   /mnt/data/A_digital_placeholder_image_features_a_light_gray_.png
 *   For production, move the image into `public/` (e.g. /public/hero.png)
 *   and update heroImageUrl to "/hero.png".
 */
const heroImageUrl = "/mnt/data/A_digital_placeholder_image_features_a_light_gray_.png";

export default function HomePage() {
    const [filteredItems, setFilteredItems] = useState(items);

  // pick a few trending items (first item of each category or top 6)
  const trending: Item[] = items.slice(0, 6);

  return (
    <>
        <Seo
            title="The Find 7 — Find the right one."
            description="We search, compare, and curate thousands of lists so you don’t have to. Seven ways to the right fit — every time."
        />

        <div className="container pt-6">
            <HeroCarousel />
        </div>

        <section className="w-full flex justify-center mt-12">
            <div className="container max-w-6xl px-6">
                <SmartFilters
                items={items}
                onChange={(filtered) => setFilteredItems(filtered)}
                categories={["All", ...new Set(items.map(i => i.category))]}
                />
            </div>
        </section>


      {/* CATEGORIES GRID */}
      <section id="categories" className="container max-w-6xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold">Categories</h2>
          <p className="text-sm text-neutral">Seven ways to decide — browse by right-fit.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group block rounded-2xl border p-6 bg-white hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{cat.emoji}</div>
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-[var(--green)]">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-neutral mt-1">{cat.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING / TOP PICKS */}
      <section className="container max-w-6xl mx-auto py-12 px-6 bg-transparent">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top Picks of the Week</h2>
          <Link href="/categories" className="text-sm text-neutral hover:underline">View all categories →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((it, i) => (
            <ItemCard
              key={it.slug}
              rank={i + 1}
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
      </section>

      {/* CTA */}
      <section className="container max-w-6xl mx-auto py-12 px-6">
        <div className="rounded-2xl p-8 bg-[var(--color-background)] border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">Want curated picks delivered?</h3>
              <p className="text-neutral">Sign up for daily shortlists and the best picks in your inbox.</p>
            </div>

            <div>
              <Link href="/signup" className="btn inline-block px-6 py-3 bg-[var(--green)] text-white rounded-lg font-semibold hover:bg-[var(--green-dark)]">
                Get shortlists
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}