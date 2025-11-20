import { GetStaticPaths, GetStaticProps } from "next";
import { useState, useMemo } from "react";
import Link from "next/link";

import { categories } from "@/data/categories";
import { items, Item } from "@/data/items";
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

export default function CategoryPage({ category, categoryItems }: Props) {
    const slug = category.key.replace(/_/g, "-");

    // ----------------------------------------------------
    // SMART FILTER STATE
    // ----------------------------------------------------
    const [sortBy, setSortBy] = useState("rank");
    const [priceFilter, setPriceFilter] = useState("all");

    // ----------------------------------------------------
    // FILTER + SORT LOGIC (pure, stable, SSR-friendly)
    // ----------------------------------------------------
    const filteredItems = useMemo(() => {
        let list = [...categoryItems];

        // Price filtering
        if (priceFilter !== "all") {
            list = list.filter((item) => {
                const num = Number(item.price.replace("$", ""));

                if (priceFilter === "under50") return num < 50;
                if (priceFilter === "50to100") return num >= 50 && num <= 100;
                if (priceFilter === "100to200") return num >= 100 && num <= 200;
                if (priceFilter === "200plus") return num > 200;

                return true;
            });
        }

        // Sorting
        list.sort((a, b) => {
            if (sortBy === "rating") return b.rating - a.rating;

            if (sortBy === "price") {
                return (
                    Number(a.price.replace("$", "")) -
                    Number(b.price.replace("$", ""))
                );
            }

            // Default: rank by slug number
            return (
                Number(a.slug.split("-")[1]) -
                Number(b.slug.split("-")[1])
            );
        });

        return list;
    }, [categoryItems, sortBy, priceFilter]);

    return (
        <div className="container py-12">

            {/* Breadcrumbs */}
            <nav className="text-sm text-neutral mb-6">
                <Link href="/" className="hover:underline">Home</Link>
                {" / "}
                <span className="text-black">{category.name}</span>
            </nav>

            {/* Category Header */}
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-3">
                    <span className="text-4xl">{category.emoji}</span>
                    {category.name}
                </h1>
                <p className="text-neutral text-lg max-w-2xl">
                    {category.description}
                </p>
            </header>

            {/* ----------------------------------------------------
                SMART FILTER BAR
            ---------------------------------------------------- */}
            <div className="w-full mb-10 p-4 bg-white border rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Sorting */}
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border p-2 rounded-md"
                    >
                        <option value="rank">Rank</option>
                        <option value="rating">Rating — High to Low</option>
                        <option value="price">Price — Low to High</option>
                    </select>
                </div>

                {/* Price Filter */}
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Price:</span>
                    <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="border p-2 rounded-md"
                    >
                        <option value="all">All</option>
                        <option value="under50">Under $50</option>
                        <option value="50to100">$50 – $100</option>
                        <option value="100to200">$100 – $200</option>
                        <option value="200plus">$200+</option>
                    </select>
                </div>
            </div>

            {/* ----------------------------------------------------
                ITEM GRID
            ---------------------------------------------------- */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item, i) => (
                    <ItemCard
                        key={item.slug}
                        rank={i + 1}
                        title={item.title}
                        subtitle={item.subtitle}
                        image={item.image}
                        price={item.price}
                        rating={item.rating}
                        slug={item.slug}
                        category={category.key}
                    />
                ))}
            </section>
        </div>
    );
}

/* ----------------------------------------------------
   STATIC PATHS
---------------------------------------------------- */
export const getStaticPaths: GetStaticPaths = async () => {
    const paths = categories.map((c) => ({
        params: { category: c.key.replace(/_/g, "-") },
    }));

    return { paths, fallback: false };
};

/* ----------------------------------------------------
   STATIC PROPS
---------------------------------------------------- */
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