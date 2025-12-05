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

  // Compare modal state
  const [showCompare, setShowCompare] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Wishlist stub (temporary; replace with global store)
  const [wishlisted, setWishlisted] = useState(false);

  // De-duplicate items for comparison and keep stable identity
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

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showCompare ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showCompare]);

  // Numeric price helper
  const numericPrice = useMemo(() => {
    const p = item.price ? String(item.price).replace(/[^0-9.]/g, "") : "0";
    return Number(p);
  }, [item.price]);

  // Canonical / JSON-LD safe URL (stable for SSR + client)
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thefind7.com";
  const canonical = `${site}/${category.slug}/${item.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    image: [devPlaceholder(item.image)],
    description: item.subtitle,
    sku: item.slug,
    brand: { "@type": "Brand", name: "The Find 7" },
    offers: {
      "@type": "Offer",
      url:
        typeof window !== "undefined"
          ? window.location.href
          : `https://example.com/${category.slug}/${item.slug}`,
      priceCurrency: "USD",
      price: (item.price || "$0").replace(/[^\d.]/g, ""),
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: item.rating ?? 0,
      reviewCount: 12,
    },
  };

  return (
    <>
      <Seo title={`${item.title} — ${category.name} — The Find 7`} description={item.subtitle ?? ""} />

      {/* JSON-LD (server-stable canonical URL) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container py-12 lg:py-16 space-y-12">
        {/* Breadcrumbs */}
        <nav className="text-sm text-neutral mb-4" aria-label="Breadcrumb">
          <Link href="/">Home</Link> /
          <Link href={`/${categoryToSlug(category.key)}`} className="hover:underline"> {category.name}</Link> /
          <span className="text-black" aria-current="page">{item.title}</span>
        </nav>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-10">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl md:text-3xl font-extrabold">{item.title}</h1>

              {/* Wishlist heart (top-right of heading) */}
              <div className="ml-4">
                <HeartButton initial={wishlisted} onToggle={(v) => setWishlisted(v)} />
              </div>
            </div>

            {/* Gallery */}
            <ProductGallery images={[devPlaceholder(item.image)]} title={item.title} />

            {/* Specs + Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-xl p-7 lg:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-8">
                <section aria-labelledby="specs-heading">
                  <h3 id="specs-heading" className="font-semibold mb-4">Specs</h3>
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
                      <div className="text-xs text-neutral-500">Connectivity</div>
                      <div className="font-medium">Wi‑Fi, Bluetooth</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500">Warranty</div>
                      <div className="font-medium">2 years</div>
                    </div>
                  </div>
                </section>

                <hr />

                <section aria-labelledby="reviews-heading">
                  <h3 id="reviews-heading" className="font-semibold mb-4">What reviewers say</h3>
                  <div className="text-sm text-neutral-700 space-y-3">
                    <article className="bg-neutral-50 rounded-md p-3" aria-label="review">
                      <div className="text-sm font-medium">Great all‑rounder</div>
                      <div className="text-xs text-neutral-500">by Jordan — 4.5</div>
                      <div className="text-xs text-neutral-600 mt-1">Solid build and great battery life for the price.</div>
                    </article>

                    <article className="bg-neutral-50 rounded-md p-3" aria-label="review">
                      <div className="text-sm font-medium">Value pick</div>
                      <div className="text-xs text-neutral-500">by Morgan — 4.0</div>
                      <div className="text-xs text-neutral-600 mt-1">Perfect if you want reliable performance without fuss.</div>
                    </article>
                  </div>
                </section>
              </div>

              {/* Sticky CTA */}
              <aside className="bg-white rounded-xl p-7 lg:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-6 h-max sticky top-24">
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
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                    className="w-20 px-3 py-2 border rounded-md"
                    aria-label="Quantity"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => alert(`Added ${qty} × ${item.title} to cart (demo).`)}
                    className="w-full py-2 rounded-md bg-[var(--green)] text-white shadow hover:bg-[var(--green-dark)] transition"
                  >
                    Add to cart
                  </button>

                  <button
                    onClick={() => setWishlisted((s) => !s)}
                    className="w-full py-2 rounded-md border text-sm flex items-center justify-center gap-2"
                    aria-pressed={wishlisted}
                  >
                    <span>{wishlisted ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    onClick={() => setShowCompare(true)}
                    className="w-full py-2 rounded-md border text-sm hover:bg-gray-50 transition font-medium"
                    aria-haspopup="dialog"
                  >
                    Compare →
                  </button>
                </div>

                <div className="mt-2 text-xs text-neutral-500">Free returns · 30 days · Secure payment</div>
              </aside>
            </div>
          </div>

          {/* RIGHT SIDEBAR — Related Picks */}
          <div className="lg:col-span-5 space-y-10">
            <div className="bg-white rounded-xl p-6 lg:p-7 shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-6">
              <h3 className="font-semibold">Related picks</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                {related.map((r, i) => (
                  <ItemCard
                    key={r.slug}
                    rank={i + 1}
                    title={r.title}
                    subtitle={r.subtitle ?? ''}
                    image={r.image}
                    price={r.price}
                    rating={r.rating}
                    slug={r.slug}
                    category={r.category}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 lg:p-7 shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-3">
              <h4 className="font-semibold mb-1">Need help deciding?</h4>
              <p className="text-sm text-neutral-600">Our weekly shortlists highlight the best products across categories — curated by The Find 7 editors.</p>
              <Link href="/signup">
                <div className="inline-block bg-[var(--green)] text-white px-4 py-2 rounded-md mt-3">Get shortlists</div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARE MODAL */}
      {showCompare && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4" role="dialog" aria-modal="true">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setShowCompare(false)}
              className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700 text-xl"
              aria-label="Close compare dialog"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4">Compare Products</h2>
            <p className="text-neutral-600 mb-6">Select items you want to compare</p>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {allCompareItems.map((p) => (
                <label key={p.slug} className="flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <Checkbox
                    checked={selectedItems.includes(p.slug)}
                    onCheckedChange={() => toggleSelect(p.slug)}
                    label={`Select ${p.title} to compare`}
                  />
                  

                  <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden relative">
                    <Image alt={p.title} src={devPlaceholder(p.image)} fill className="object-cover" />
                  </div>

                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-neutral-600">{p.subtitle}</p>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={() => {
                if (selectedItems.length < 2) return;
                const query = selectedItems.join(",");
                router.push(`/compare?items=${query}`);
                setShowCompare(false);
              }}
              disabled={selectedItems.length < 2}
              className="mt-6 w-full py-3 rounded-lg font-semibold transition text-white disabled:bg-gray-300 disabled:cursor-not-allowed bg-[var(--green)] hover:bg-[var(--green-dark)]"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* static paths */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allItems.map((it) => ({
    params: {
      category: categoryToSlug(it.category),
      slug: it.slug,
    },
  }));

  return { paths, fallback: false };
};

/* static props */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryParam = params?.category as string;
  const slugParam = params?.slug as string;

  const categoryKey = slugToCategory(categoryParam);

  const category = categories.find((c) => c.key === categoryKey);
  if (!category) return { notFound: true };

  const item = allItems.find((i) => i.slug === slugParam && i.category === categoryKey);
  if (!item) return { notFound: true };

  const related = allItems.filter((i) => i.category === categoryKey && i.slug !== slugParam).slice(0, 6);

  return { props: { item, category, related } };
};
