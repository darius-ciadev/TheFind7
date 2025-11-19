import Seo from '../components/Seo'
import Hero from '../components/Hero'
import Card from '../components/Card'

export default function Home() {
    return (
        <>
        <Seo 
            title="Find7 — Discover what matters"
            description="Find7 — curated categories and simple discovery."
        />
        
        <section className="container">
            <Hero />

            <div className="grid">
                {/* Placeholder cards — you can update later */}
                <Card title="Category A" description="Short description" />
                <Card title="Category B" description="Short description" />
                <Card title="Category C" description="Short description" />
            </div>
        </section>
        </>
    )
}
