import React, { useMemo, useState } from "react";
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
import { slugToCategory, categoryToSlug, itemUrl } from "@/utils/urls";

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

  const numericPrice = useMemo(() => {
    const p = item.price ? String(item.price).replace(/[^0-9.]/g, "") : "0";
    return Number(p);
  }, [item.price]);

  return (
    <>
      <Seo title={`${item.title} — ${category.name} — The Find 7`} description={item.subtitle} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Main Container */}
      <div className="container py-12 lg:py-16 space-y-12">

        {/* Breadcrumbs */}
        <nav className="text-sm text-neutral mb-4">
          <Link href="/">Home</Link> /{" "}
          <Link href={`/${categoryToSlug(category.key)}`} className="hover:underline">
            {category.name}
          </Link>{" "}
          / <span className="text-black">{item.title}</span>
        </nav>

        {/* Page Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Left Section */}
          <div className="lg:col-span-7 space-y-10">

            {/* PRODUCT GALLERY */}
            <ProductGallery images={[item.image]} title={item.title} />

            {/* SPECS + REVIEWS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Specs + Reviews */}
              <div className="lg:col-span-2 bg-white rounded-xl p-7 lg:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-8">

                {/* Specs */}
                <div>
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
                      <div className="text-xs text-neutral-500">Connectivity</div>
                      <div className="font-medium">Wi-Fi, Bluetooth</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500">Warranty</div>
                      <div className="font-medium">2 years</div>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Reviews */}
                <div>
                  <h3 className="font-semibold mb-4">What reviewers say</h3>
                  <div className="text-sm text-neutral-700 space-y-3">
                    <div className="bg-neutral-50 rounded-md p-3">
                      <div className="text-sm font-medium">Great all-rounder</div>
                      <div className="text-xs text-neutral-500">by Jordan — 4.5</div>
                      <div className="text-xs text-neutral-600 mt-1">
                        Solid build and great battery life for the price.
                      </div>
                    </div>

                    <div className="bg-neutral-50 rounded-md p-3">
                      <div className="text-sm font-medium">Value pick</div>
                      <div className="text-xs text-neutral-500">by Morgan — 4.0</div>
                      <div className="text-xs text-neutral-600 mt-1">
                        Perfect if you want reliable performance without fuss.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky CTA */}
              <aside className="bg-white rounded-xl p-7 lg:p-8 shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-6 h-max">
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
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => alert(`Added ${qty} × ${item.title} to cart (demo).`)}
                    className="w-full py-3 rounded-md bg-[var(--green)] text-white font-medium shadow hover:bg-[var(--green-dark)] transition"
                  >
                    Add to cart
                  </button>

                  <button
                    onClick={() => alert("Added to wishlist (demo).")}
                    className="w-full py-2 rounded-md border text-sm"
                  >
                    Add to wishlist
                  </button>
                </div>

                <div className="mt-2 text-xs text-neutral-500">
                  Free returns · 30 days · Secure payment
                </div>
              </aside>
            </div>
          </div>

          {/* RIGHT SIDEBAR — Related Picks */}
          <div className="lg:col-span-5 space-y-10">

            {/* Related Picks */}
            <div className="bg-white rounded-xl p-6 lg:p-7 shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-6">
              <h3 className="font-semibold">Related picks</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                {related.map((r) => (
                  <ItemCard
                    key={r.slug}
                    rank={1}
                    title={r.title}
                    subtitle={r.subtitle}
                    image={r.image}
                    price={r.price}
                    rating={r.rating}
                    slug={r.slug}
                    category={r.category}
                  />
                ))}
              </div>
            </div>

            {/* Promo Box */}
            <div className="bg-white rounded-xl p-6 lg:p-7 shadow-[0_4px_12px_rgba(0,0,0,0.04)] space-y-3">
              <h4 className="font-semibold mb-1">Need help deciding?</h4>
              <p className="text-sm text-neutral-600">
                Our weekly shortlists highlight the best products across categories — curated by The
                Find 7 editors.
              </p>
              <Link href="/signup">
                <div className="inline-block bg-[var(--green)] text-white px-4 py-2 rounded-md mt-3">
                  Get shortlists
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
  const paths = allItems.map((it) => ({
    params: {
      category: categoryToSlug(it.category), // DB → URL
      slug: it.slug,
    },
  }));

  return { paths, fallback: false };
};

/* static props */
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryParam = params?.category as string; // URL slug
  const slugParam = params?.slug as string;

  const categoryKey = slugToCategory(categoryParam); // URL → DB key

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