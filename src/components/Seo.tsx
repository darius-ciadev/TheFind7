import Head from 'next/head'

type Props = { 
    title?: string
    description?: string
}

export default function Seo({ 
    title = 'Find7', 
    description = '' 
}: Props) {
    const ogTitle = title

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />

            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />

            <link rel="icon" href="/favicon.svg" />
        </Head>
    )
}
