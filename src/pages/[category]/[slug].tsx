"use client";

import React, { useMemo, useState, useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import Seo from "@/components/Seo";
import ItemCard from "@/components/ItemCard";
import { categories } from "@/data/categories";
import { items as allItems, Item } from "@/data/items";
import { devPlaceholder } from "@/utils/devPlaceholder";
import { ProductGallery } from "@/components/ProductGallery";
import { slugToCategory, categoryToSlug } from "@/utils/urls";
import HeartButton from "@/components/HeartButton";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  item: Item;
  category: {
    key: string;
    name: string;
    slug: string;
    emoji: string;
    description?: string;
  };
  related: Item[];
};

export default function ProductPage({ item, category, related }: Props) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  // Compare modal
  const [showCompare, setShowCompare] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAllRelated, setShowAllRelated] = useState(false);

  // Prevent scroll on compare modal
  useEffect(() => {
    document.body.style.overflow = showCompare ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCompare]);

  const allCompareItems = useMemo(() => {
    const map = new Map<string, Item>();
    [item, ...related].forEach((p) => map.set(p.slug, p));
    return Array.from(map.values());
  }, [item, related]);

  function toggleSelect(slug: string) {
    setSelectedItems((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  // JSON-LD data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    image: [devPlaceholder(item.image)],
    description: item.subtitle,
    sku: item.slug,
    brand: { "@type": "Brand", name: "The Find 7" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: item.rating ?? 0,
      reviewCount: 12,
    },
  };

  return (
    <>
      <Seo
        title={`${item.title} — ${category.name} — The Find 7`}
        description={item.subtitle ?? ""}
      />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* PAGE CONTAINER */}
      <div className="container py-12 lg:py-16 space-y-12">
        {/* BREADCRUMBS */}
        <nav className="text-sm text-neutral mb-4">
          <Link href="/">Home</Link> /{" "}
          <Link
            href={`/${categoryToSlug(category.key)}`}
            className="hover:underline"
          >
            {category.name}
          </Link>{" "}
          / <span className="text-black">{item.title}</span>
        </nav>

        {/* GRID LAYOUT — BALANCED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-10">
            {/* Title + Wishlist */}
            <div className="flex items-start justify-between">
              <h1 className="text-2xl md:text-3xl font-extrabold">
                {item.title}
              </h1>
              <HeartButton
                initial={wishlisted}
                onToggle={(v) => setWishlisted(v)}
              />
            </div>

            {/* Gallery */}
            <ProductGallery
              images={[devPlaceholder(item.image)]}
              title={item.title}
            />

            {/* Specs + Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* MAIN SPEC CARD */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 lg:p-7 shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-8">
                <section>
                  <h3 className="font-semibold mb-4">Specs</h3>
                  <div className="grid grid-cols-2 gap-5 text-sm text-neutral-700">
                    <div>
                      <div className="text-xs text-neutral-500">Weight</div>
                      <div className="font-medium">1.2 kg</div>
                    </div>

                    <div>
                      <div className="text-xs text-neutral-500">Battery</div>
                      <div className="font-medium">Up to 10 hrs</div>
                    </div>

                    <div>
                      <div className="text-xs text-neutral-500">
                        Connectivity
                      </div>
                      <div className="font-medium">Wi-Fi, Bluetooth</div>
                    </div>

                    <div>
                      <div className="text-xs text-neutral-500">Warranty</div>
                      <div className="font-medium">2 years</div>
                    </div>
                  </div>
                </section>

                <hr />

                <section>
                  <h3 className="font-semibold mb-4">What reviewers say</h3>
                  <div className="space-y-3 text-sm text-neutral-700">
                    <article className="bg-neutral-50 rounded-md p-3">
                      <div className="text-sm font-medium">
                        Great all-rounder
                      </div>
                      <div className="text-xs text-neutral-500">
                        by Jordan — 4.5
                      </div>
                      <p className="text-xs text-neutral-600 mt-1">
                        Solid build and great battery life for the price.
                      </p>
                    </article>

                    <article className="bg-neutral-50 rounded-md p-3">
                      <div className="text-sm font-medium">Value pick</div>
                      <div className="text-xs text-neutral-500">
                        by Morgan — 4.0
                      </div>
                      <p className="text-xs text-neutral-600 mt-1">
                        Perfect if you want reliable performance without fuss.
                      </p>
                    </article>
                  </div>
                </section>
              </div>

              {/* STICKY CTA */}
              <aside className="bg-white rounded-2xl p-6 lg:p-7 shadow-[0_4px_12px_rgba(0,0,0,0.04)] h-max space-y-6 sticky top-24">
                <div className="text-sm text-neutral-500">Price</div>

                <div className="flex items-center justify-between">
                  <div className="text-3xl font-extrabold">{item.price}</div>
                  <div className="text-xs text-neutral-500">In stock</div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm">Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.max(1, Number(e.target.value || 1)))
                    }
                    className="w-20 px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="space-y-3">
                  <button className="w-full py-2 rounded-md bg-[var(--green)] text-white shadow hover:bg-[var(--green-dark)] transition">
                    Add to cart
                  </button>

                  <button
                    onClick={() => setWishlisted((s) => !s)}
                    className="w-full py-2 rounded-md border text-sm flex items-center justify-center gap-2"
                  >
                    {wishlisted ? "Saved" : "Save"}
                  </button>

                  <button
                    onClick={() => setShowCompare(true)}
                    className="w-full py-2 rounded-md border text-sm hover:bg-gray-50 transition font-medium"
                  >
                    Compare →
                  </button>
                </div>

                <div className="mt-2 text-xs text-neutral-500">
                  Free returns · 30 days · Secure payment
                </div>
              </aside>
            </div>
          </div>

          {/* RIGHT SIDEBAR (improved polish) */}
          <div className="lg:col-span-5 space-y-10">
            {/* Related Picks Card */}
            <div
              className="
    bg-white rounded-2xl 
    p-6 lg:p-7 
    shadow-[0_4px_12px_rgba(0,0,0,0.04)] 
    border border-neutral-100 
    space-y-6
  "
            >
              <h3 className="font-semibold text-lg text-neutral-900">
                Related picks
              </h3>

              <div className="space-y-5">
                {(showAllRelated ? related : related.slice(0, 3)).map(
                  (r, i) => (
                    <div
                      key={r.slug}
                      className="
            transition-all duration-200 
            hover:-translate-y-[2px] 
            hover:shadow-[0_4px_10px_rgba(0,0,0,0.05)]
            rounded-xl
          "
                    >
                      <ItemCard
                        sidebar
                        rank={i + 1}
                        title={r.title}
                        subtitle={r.subtitle ?? ""}
                        image={r.image}
                        price={r.price}
                        rating={r.rating}
                        slug={r.slug}
                        category={r.category}
                      />
                    </div>
                  )
                )}
              </div>

              {related.length > 3 && (
                <button
                  onClick={() => setShowAllRelated(!showAllRelated)}
                  className="
          w-full text-center 
          py-2 text-sm font-medium 
          text-[var(--green)] 
          hover:text-[var(--green-dark)] 
          transition
        "
                >
                  {showAllRelated
                    ? "Show less"
                    : `Show ${related.length - 3} more`}
                </button>
              )}
            </div>

            {/* Help Card */}
            <div
              className="
    bg-white rounded-2xl 
    p-6 lg:p-7 
    shadow-[0_4px_12px_rgba(0,0,0,0.04)] 
    border border-neutral-100 
    space-y-3
  "
            >
              <h4 className="font-semibold text-neutral-900">
                Need help deciding?
              </h4>

              <p className="text-sm text-neutral-600 leading-relaxed">
                Our weekly shortlists highlight the best products across
                categories — curated by The Find 7 team.
              </p>

              <Link href="/signup" className="block mt-2">
                <div
                  className="
        inline-block bg-[var(--green)] text-white 
        px-4 py-2 rounded-md text-sm font-medium 
        hover:bg-[var(--green-dark)] transition
      "
                >
                  Get shortlists
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARE MODAL */}
      {showCompare && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowCompare(false)}
              className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700 text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4">Compare Products</h2>
            <p className="text-neutral-600 mb-6">
              Select items you want to compare
            </p>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {allCompareItems.map((p) => (
                <label
                  key={p.slug}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedItems.includes(p.slug)}
                    onCheckedChange={() => toggleSelect(p.slug)}
                    label={`Select ${p.title} to compare`}
                  />

                  <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden relative">
                    <Image
                      src={devPlaceholder(p.image)}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-neutral-600">{p.subtitle}</p>
                  </div>
                </label>
              ))}
            </div>

            <button
              disabled={selectedItems.length < 2}
              onClick={() => {
                const query = selectedItems.join(",");
                router.push(`/compare?items=${query}`);
                setShowCompare(false);
              }}
              className="mt-6 w-full py-3 rounded-lg font-semibold bg-[var(--green)] text-white disabled:bg-gray-300 hover:bg-[var(--green-dark)] transition"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* STATIC PATHS */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allItems.map((it) => ({
    params: {
      category: categoryToSlug(it.category),
      slug: it.slug,
    },
  }));

  return { paths, fallback: false };
};

/* STATIC PROPS */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryParam = params?.category as string;
  const slugParam = params?.slug as string;

  const categoryKey = slugToCategory(categoryParam);
  const category = categories.find((c) => c.key === categoryKey);
  if (!category) return { notFound: true };

  const item = allItems.find(
    (i) => i.slug === slugParam && i.category === categoryKey
  );
  if (!item) return { notFound: true };

  const related = allItems
    .filter((i) => i.category === categoryKey && i.slug !== slugParam)
    .slice(0, 6);

  return { props: { item, category, related } };
};
