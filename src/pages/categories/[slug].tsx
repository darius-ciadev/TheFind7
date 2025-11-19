import { useRouter } from 'next/router'
import Seo from '../../components/Seo'

export default function CategoryPage() {
    const router = useRouter()
    const { slug } = router.query

    return (
        <>
            <Seo 
                title={`${slug} — Category`} 
                description={`Listing for ${slug}`} 
            />

            <section className="container">
                <h1>{slug}</h1>
                <p>Category listing placeholder.</p>
            </section>
        </>
    )
}