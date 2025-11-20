import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { items, Item } from "@/data/items";
import { categories } from "@/data/categories";

type Props = {
    item: Item;
    category: {
        key: string;
        name: string;
        slug: string;
        emoji: string;
        description: string;
    };
    alternatives: Item[];
};

export default function ProductDetailPage({ item, category, alternatives }: Props) {
    const placeholder = "/placeholder.png";
    const imageSrc = item.image || placeholder;

    return (
        <>
            <Head>
                <title>{item.title} — {category.name} | The Find 7</title>
                <meta name="description" content={item.subtitle} />
            </Head>

            <div className="section container">
                
                {/* Category back link */}
                <Link href={`/${category.slug}`} className="text-green-700 hover:underline text-sm">
                    ← Back to {category.emoji} {category.name}
                </Link>

                {/* Title */}
                <h1 className="text-4xl font-extrabold mt-3 mb-2">
                    {item.title}
                </h1>

                <p className="text-neutral text-lg mb-8">{item.subtitle}</p>

                {/* Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Product Image */}
                    <div className="w-full rounded-xl overflow-hidden bg-gray-200">
                        <Image
                            src={imageSrc}
                            alt={item.title}
                            width={800}
                            height={600}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Details */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-yellow-500 text-xl">⭐</span>
                            <span className="text-lg font-semibold">{item.rating || "4.5"}</span>
                        </div>

                        <p className="text-3xl font-bold mb-4">
                            {item.price ? `$${item.price}` : "$—"}
                        </p>

                        {/* CTA */}
                        <button className="bg-[var(--green)] text-white px-6 py-3 rounded-lg font-semibold text-lg mb-8 hover:bg-[var(--green-dark)] transition">
                            View Item
                        </button>

                        {/* Item description (long text expandable later) */}
                        <p className="text-neutral leading-relaxed">
                            {category.description || "This product delivers excellent performance and value within its category."}
                        </p>
                    </div>
                </div>

                {/* Alternatives */}
                {alternatives.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">Top Alternatives</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {alternatives.map((alt) => (
                                <Link
                                    key={alt.slug}
                                    href={`/${category.slug}/${alt.slug}`}
                                    className="block border rounded-xl p-5 hover:shadow-md transition bg-white"
                                >
                                    <h3 className="font-semibold mb-2">{alt.title}</h3>
                                    <p className="text-sm text-neutral mb-2">{alt.subtitle}</p>
                                    <span className="text-yellow-500">⭐ {alt.rating}</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}


/* ----------------------------------------------------
   STATIC PATHS: Build all category/item combinations
----------------------------------------------------- */
export const getStaticPaths: GetStaticPaths = async () => {
    const paths = items.map((item) => ({
        params: {
            slug: item.category,
            item: item.slug
        }
    }));

    return {
        paths,
        fallback: false,
    };
};


/* ----------------------------------------------------
   STATIC PROPS: Provide full item + category data
----------------------------------------------------- */
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const slug = params?.slug as string;
    const itemSlug = params?.item as string;

    const item = items.find((i) => i.slug === itemSlug);
    if (!item) return { notFound: true };

    const category = categories.find((c) => c.key === slug);
    if (!category) return { notFound: true };

    // Alternatives from same category
    const alternatives = items
        .filter((i) => i.category === slug && i.slug !== itemSlug)
        .slice(0, 6);

    return {
        props: {
            item,
            category,
            alternatives,
        },
        revalidate: 60 * 60,
    };
};
