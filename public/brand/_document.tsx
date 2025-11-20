import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
        <Head>
            {/* FAVICONS */}
            <link rel="icon" href="/brand/favicon.png" />
            <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />

            {/* ANDROID ICONS */}
            <link rel="icon" sizes="192x192" href="/brand/android-chrome-192x192.png" />
            <link rel="icon" sizes="512x512" href="/brand/android-chrome-512x512.png" />

            <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />

            {/* MANIFEST */}
            <link rel="manifest" href="/site.webmanifest" />

            {/* THEME COLOR */}
            <meta name="theme-color" content="#009B75" />

            {/* OG IMAGE FALLBACK */}
            <meta property="og:image" content="/brand/og-image.png" />
        </Head>

        <body>
            <Main />
            <NextScript />
        </body>
        </Html>
    );
}
