export default function Hero() {
    return (
        <section className="bg-background text-primary py-24">
            <div className="container max-w-3xl">
                <h1 className="text-6xl font-bold leading-tight mb-6">
                    Find the right one.
                </h1>

                <p className="text-xl text-neutral mb-8 leading-relaxed">
                    We search, compare, and curate thousands of lists so you don’t have to.  
                    Seven ways to the right fit — every time.
                </p>

                <a
                href="#categories"
                className="inline-block bg-primary text-background px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition"
                >
                    Start discovering
                </a>
            </div>
        </section>
    );
}
