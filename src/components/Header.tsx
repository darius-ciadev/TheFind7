import Link from 'next/link'

export default function Header() {
    return (
            <header className="site-header">
                <div className="container header-inner">
                    <Link href="/" className="brand">
                        <img 
                            src="/the_find_7_logo.svg" 
                            alt="Find7" 
                            height={32} 
                        />
                    </Link>

                    <nav>
                        <Link href="/">Home</Link>
                        <Link href="/about">About</Link>
                    </nav>
                </div>
            </header>
    )
}
