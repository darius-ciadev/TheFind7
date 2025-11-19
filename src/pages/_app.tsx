import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Footer from '../components/Footer'
import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Header />
                <main>
                    <Component {...pageProps} />
                </main>
            <Footer />
        </>
    )
}