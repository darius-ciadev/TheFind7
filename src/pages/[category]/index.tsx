import { GetStaticPaths, GetStaticProps } from "next";
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

            {/* Item Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryItems.map((item, i) => (
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
   STATIC PATHS: Build one page per category
----------------------------------------------------- */
export const getStaticPaths: GetStaticPaths = async () => {
    const paths = categories.map((c) => ({
        params: { 
            category: c.key.replace(/_/g, "-") 
        },
    }));

    return { paths, fallback: false };
};

/* ----------------------------------------------------
   STATIC PROPS: Provide category + items
----------------------------------------------------- */
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const categoryParam = params?.category as string;

    // Convert hyphens → underscores
    const realCategoryKey = categoryParam.replace(/-/g, "_");

    const category = categories.find((c) => c.key === realCategoryKey);
    if (!category) return { notFound: true };

    const categoryItems = items.filter((i) => i.category === realCategoryKey);

    return {
        props: {
            category,
            categoryItems,
        },
        revalidate: 3600,
    };
};