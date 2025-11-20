import Link from "next/link";
import { categories } from "@/data/categories";
import Seo from "@/components/Seo";

export default function HomePage() {
    return (
        <>
            <Seo
                title="The Find 7 — Find the right one."
                description="We search, compare, and curate thousands of lists so you don’t have to. Seven ways to the right fit — every time."
            />

            {/* HERO SECTION */}
            <section className="section">
                <div className="container">
                <h1 className="text-4xl font-extrabold mb-4">
                    Find the right one.
                </h1>

                <p className="text-lg text-gray-700 max-w-2xl mb-6">
                    We search, compare, and curate thousands of lists so you don’t have to.
                    Seven ways to the right fit — every time.
                </p>

                <Link
                    href="#categories"
                    className="btn inline-block mt-2"
                >
                    Start discovering
                </Link>
                </div>
            </section>

            {/* CATEGORY GRID */}
            <section id="categories" className="section">
                <div className="container">
                    <h2 className="text-3xl font-bold mb-8">Categories</h2>

                    <div className="grid-layout" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
                        {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/${cat.slug}`}
                            className="card p-6 block hover:shadow-md"
                        >
                            <div className="category-row mb-2">
                            <span style={{ fontSize: "1.6rem" }}>{cat.icon}</span>
                            <h3 className="text-xl font-semibold ml-2">{cat.name}</h3>
                            </div>

                            <p className="text-gray-600 text-sm">{cat.description}</p>
                        </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED ROW */}
            <section className="section">
            <div className="container">
            <h2 className="text-2xl font-bold mb-5">Top Picks of the Week</h2>

            <div className="grid-layout" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                {categories.slice(0, 7).map((cat) => (
                <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="card p-5"
                >
                    <h3 className="font-semibold mb-1">{cat.name}</h3>
                    <p className="text-gray-600 text-sm">{cat.description}</p>
                </Link>
                ))}
            </div>
            </div>
            </section>
        </>
    );
}
