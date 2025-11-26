import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { devPlaceholder } from "@/utils/devPlaceholder";

import { items, Item } from "@/data/items";
import { categories, Category } from "@/data/categories";

type Props = {
    item: Item;
    category: Category;
    related: Item[];
};

export default function ProductDetailPage({ item, category, related }: Props) {
  const router = useRouter();
  const imageSrc = devPlaceholder(item.image);

  const [showMiniHeader, setShowMiniHeader] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const [showCompare, setShowCompare] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const allCompareItems = [item, ...related];

  function toggleSelect(slug: string) {
    setSelectedItems((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  // ► Sticky mini-header behavior
  useEffect(() => {
    function onScroll() {
      setShowMiniHeader(window.scrollY > 220); // appears after scroll
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const productUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://thefind7.com/${category.slug}/${item.slug}`;

  const priceNumber =
    typeof item.price === "string"
      ? Number(String(item.price).replace(/[^0-9.]/g, "")) || undefined
      : typeof item.price === "number"
      ? item.price
      : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description: item.subtitle,
    image: imageSrc,
    brand: "TheFind7 Editorial",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: item.rating,
      reviewCount: 120,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: priceNumber ?? "0",
      availability: "https://schema.org/InStock",
      url: productUrl,
    },
  };

  return (
    <>
      <Head>
        <title>{item.title} — Best {category.name} | The Find 7</title>
        <meta name="description" content={item.subtitle} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* -------------------------------------- */}
      {/*  🔥 Sticky Mini-Header (added by Savvy) */}
      {/* -------------------------------------- */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b transition-all duration-300 ${
          showMiniHeader ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container flex items-center justify-between py-3">
          <div className="flex flex-col">
            <span className="text-sm text-neutral-600">{category.name}</span>
            <strong className="text-base font-semibold">{item.title}</strong>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm flex items-center gap-1">
              ⭐ {item.rating}
            </span>
            <span className="font-semibold">{item.price}</span>

            <a
              href="#"
              className="bg-[var(--green)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--green-dark)] transition"
              onClick={(e) => {
                e.preventDefault();
                window.alert("Open affiliate / best price link (placeholder).");
              }}
            >
              View Best Price →
            </a>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-neutral mb-6 flex flex-wrap gap-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href={`/${category.slug}`} className="hover:underline">
            {category.name}
          </Link>
          <span>/</span>
          <span className="text-black">{item.title}</span>
        </nav>

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left — image */}
          <div className="rounded-xl overflow-hidden shadow-md bg-gray-100 relative">
            <div className="w-full h-[420px] relative">
              <Image
                src={imageSrc}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right — content */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{item.title}</h1>

            <p className="text-neutral-600 text-lg mb-6 max-w-xl">{item.subtitle}</p>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-lg">
                <span aria-hidden>⭐</span>
                <span className="font-medium">{item.rating.toFixed(1)}</span>
              </div>

              <div className="text-xl font-semibold">
                {item.price ?? "$—"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {category.name}
              </span>

              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Rank #{String(item.slug).split("-")[1] ?? "—"}
              </span>
            </div>

            {/* CTA block */}
            <div className="space-y-3">
              <a
                className="inline-block w-full text-center bg-[var(--green)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--green-dark)] transition"
                href="#"
                onClick={(e) => {
                  // placeholder action — replace with affiliate/action link
                  e.preventDefault();
                  window.alert("Open affiliate / best price link (placeholder).");
                }}
              >
                View Best Price →
              </a>

              <Link
                href={`/${category.slug}`}
                className="inline-block w-full text-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Back to {category.name}
              </Link>

              <button
                onClick={() => setShowCompare(true)}
                className="inline-block w-full text-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Compare →
              </button>

              <div className="text-sm text-neutral-500 mt-3 flex gap-4 items-center">
                <span>🛡️ Verified Picks</span>
                <span>🔒 Safe Links</span>
                <span>📦 No Ads, Ever</span>
              </div>
            </div>
          </div>
        </div>

        {/* PROS & CONS */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">Pros</h2>
            <ul className="space-y-3 text-neutral-800">
              <li className="flex gap-3">
                  <span className="text-green-600">✔</span>
                  <span>Strong overall performance for the price.</span>
              </li>
              <li className="flex gap-3">
                  <span className="text-green-600">✔</span>
                  <span>Highly rated by users and independent reviewers.</span>
              </li>
              <li className="flex gap-3">
                  <span className="text-green-600">✔</span>
                  <span>Reliable, durable, and easy to use.</span>
              </li>
            </ul>
          </div>

          <div>
              <h2 className="text-2xl font-bold mb-4">Cons</h2>
              <ul className="space-y-3 text-neutral-800">
              <li className="flex gap-3">
                  <span className="text-red-500">✖</span>
                  <span>Not the absolute lowest price in its category.</span>
              </li>
              <li className="flex gap-3">
                  <span className="text-red-500">✖</span>
                  <span>Some users report limited availability in certain regions.</span>
              </li>
              </ul>
          </div>
        </section>

        {/* KEY FEATURES */}
        <section className="mt-16">
            <h2 className="text-2xl font-bold mb-4">Key features</h2>
            <ul className="space-y-3 text-neutral-800">
                <li className="flex gap-3">
                <span className="text-[var(--green)]">•</span>
                <span>High-quality build and reliable performance.</span>
                </li>
                <li className="flex gap-3">
                <span className="text-[var(--green)]">•</span>
                <span>Great value for money with balanced specs.</span>
                </li>
                <li className="flex gap-3">
                <span className="text-[var(--green)]">•</span>
                <span>Backed by strong user reviews and expert picks.</span>
                </li>
            </ul>
        </section>


        {/* Related picks */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related picks</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related && related.length > 0 ? (
              related.map((it) => (
                <Link
                  key={it.slug}
                  href={`/${category.slug}/${it.slug}`}
                  className="block rounded-lg border p-4 hover:shadow-md transition group"
                >
                  <div className="relative rounded-md overflow-hidden bg-gray-100 mb-3 h-40">
                    <Image
                      src={devPlaceholder(it.image)}
                      alt={it.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-[1.03]"
                    />
                  </div>

                  <h3 className="font-semibold text-sm">{it.title}</h3>
                  <p className="text-neutral-600 text-xs line-clamp-2 mt-1">{it.subtitle}</p>
                </Link>
              ))
            ) : (
              <div className="text-neutral-600">No related picks found.</div>
            )}
          </div>
        </section>

        {/* ============================
        COMPARE MODAL
        ============================ */}
        {showCompare && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center px-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative">
              
              {/* Close Button */}
              <button
                onClick={() => setShowCompare(false)}
                className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700 text-xl"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold mb-4">Compare Products</h2>
              <p className="text-neutral-600 mb-6">Select items you want to compare:</p>

              {/* Item List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {allCompareItems.map((p) => (
                  <label
                    key={p.slug}
                    className="flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(p.slug)}
                      onChange={() => toggleSelect(p.slug)}
                    />

                    <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden relative">
                      <Image
                        alt={p.title}
                        src={devPlaceholder(p.image)}
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

              {/* CTA */}
              <button
                onClick={() => {
                  if (selectedItems.length < 2) return;

                  const query = selectedItems.join(",");
                  router.push(`/compare?items=${query}`);
                }}
                disabled={selectedItems.length < 2}
                className="mt-6 w-full py-3 rounded-lg font-semibold transition text-white
                  disabled:bg-gray-300 disabled:cursor-not-allowed 
                  bg-[var(--green)] hover:bg-[var(--green-dark)]"
              >
                Compare Now
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

/* -------------------------------
   getStaticPaths
---------------------------------*/
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = items.map((item) => ({
    params: {
      category: item.category.replace(/_/g, "-"),
      slug: item.slug,
    },
  }));

  return { paths, fallback: "blocking" };
};

/* -------------------------------
   getStaticProps
---------------------------------*/
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryParam = params?.category as string;
  const slugParam = params?.slug as string;

  const realCategoryKey = categoryParam.replace(/-/g, "_");

  const item = items.find(
    (i) => i.slug === slugParam && i.category === realCategoryKey
  );

  const category = categories.find((c) => c.key === realCategoryKey);

  if (!item || !category) {
    return { notFound: true };
  }

  // pick up to 3 related items (same category, exclude current)
  const related = items
    .filter((i) => i.category === realCategoryKey && i.slug !== item.slug)
    .slice(0, 3);

  return {
    props: { item, category, related },
    revalidate: 3600,
  };
};