import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";

import { items, Item } from "@/data/items";
import { categories, Category } from "@/data/categories";

type Props = {
    item: Item;
    category: Category;
};

export default function ProductDetailPage({ item, category }: Props) {
    const categorySlug = category.slug;
    const imageSrc = item.image || "/placeholder.png";

    return (
        <div className="container py-10">

            {/* Breadcrumbs */}
            <nav className="text-sm text-neutral mb-6">
                <Link href="/" className="hover:underline">Home</Link>
                {" / "}
                <Link href={`/${categorySlug}`} className="hover:underline">
                    {category.name}
                </Link>
                {" / "}
                <span className="text-black ml-1">{item.title}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* LEFT IMAGE */}
                <div className="rounded-xl overflow-hidden shadow-md bg-gray-100">
                    <Image
                        src={imageSrc}
                        alt={item.title}
                        width={700}
                        height={500}
                        className="w-full h-[380px] object-cover"
                    />
                </div>

                {/* RIGHT INFO */}
                <div>
                    <h1 className="text-3xl font-extrabold mb-2">{item.title}</h1>

                    <p className="text-neutral text-lg mb-4">{item.subtitle}</p>

                    <div className="flex items-center gap-6 mb-6">
                        <span className="text-lg flex items-center gap-1">
                            ⭐ <b>{item.rating}</b>
                        </span>

                        <span className="text-xl font-semibold">
                            {item.price}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {category.name}
                        </span>

                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            Rank #{item.slug.split("-")[1]}
                        </span>
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-[var(--green)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[var(--green-dark)] transition">
                            View Best Price
                        </button>

                        <Link
                            href={`/${categorySlug}`}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                        >
                            Back to category
                        </Link>
                    </div>
                </div>
            </div>

            {/* WHY WE PICKED IT */}
            <section className="mt-16">
                <h2 className="text-2xl font-bold mb-4">Why we picked it</h2>
                <p className="text-neutral text-lg leading-relaxed">
                    {item.subtitle ||
                        "This product earned its place on the list due to performance, value, and user trust."}
                </p>
            </section>
        </div>
    );
}

/* -------------------------------
STATIC PATHS
-------------------------------- */
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
STATIC PROPS
-------------------------------- */
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

    return {
        props: { item, category },
        revalidate: 3600,
    };
};