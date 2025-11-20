import Head from "next/head";
import { useRouter } from "next/router";

interface SeoProps {
    title: string;
    description: string;
    image?: string;
}

export default function Seo({
    title,
    description,
    image = "/og-image.png",
}: SeoProps) {
    const router = useRouter();

    // Absolute URL for this specific page
    const baseUrl = "https://thefind7.com";
    const fullUrl = `${baseUrl}${router.asPath === "/" ? "" : router.asPath}`;

    const fullTitle = `${title} | The Find7`;

    return (
        <Head>
            {/* Title */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    name: fullTitle,
                    description,
                    url: fullUrl,
                }),
                }}
            />
        </Head>
    );
}
