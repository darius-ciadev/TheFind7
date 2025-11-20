import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setIsDark(true);
        }
    }, []);

    return (
        <header className="w-full border-b border-gray-200">
            <div className="max-w-5xl mx-auto flex items-center justify-between px-6 h-20">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2">
                <Image
                    src={isDark ? "/brand/the_find_7_logo.png" : "/brand/logo_dark_512.png"}
                    alt="The Find 7"
                    width={45}
                    height={45}
                    priority
                />
                <span className="text-2xl font-extrabold tracking-tight">
                    The Find 7
                </span>
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex gap-8 text-lg font-medium">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/about" className="nav-link">About</Link>
                <Link href="/categories" className="nav-link">Categories</Link>
                </nav>

                {/* MOBILE MENU BUTTON */}
                <button
                className="md:hidden text-3xl"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                ☰
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-lg font-medium">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/about" className="nav-link">About</Link>
                <Link href="/categories" className="nav-link">Categories</Link>
                </div>
            )}

            <style jsx>{`
                .nav-link {
                position: relative;
                }
                .nav-link::after {
                content: "";
                position: absolute;
                bottom: -4px;
                left: 0;
                width: 0%;
                height: 2px;
                background-color: #009B75;
                transition: width 0.2s ease;
                }
                .nav-link:hover::after {
                width: 100%;
                }
            `}</style>
        </header>
    );
}
