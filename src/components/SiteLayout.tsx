"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const logoUrl = "/brand/the_find_7_logo.svg";

export default function SiteLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-body">
      {/* Header */}
      <header className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={logoUrl}
              alt="The Find 7"
              width={42}
              height={42}
              priority
            />
            <span className="text-2xl font-extrabold tracking-tight">
              The Find 7
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-lg font-medium text-[var(--green)]">

            <Link href="/" className="hover:text-[var(--green-dark)] transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-[var(--green-dark)] transition">
              About
            </Link>
            <Link href="/categories" className="hover:text-[var(--green-dark)] transition">
              Categories
            </Link>

            {/* Search Icon */}
            <button className="ml-4">
              <svg className="w-6 h-6 text-[var(--green)] hover:text-[var(--green-dark)] transition"
                   fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.65 6.15z"/>
              </svg>
            </button>

            {/* Profile Icon */}
            <button>
              <svg className="w-6 h-6 text-[var(--green)] hover:text-[var(--green-dark)] transition"
                   fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"/>
              </svg>
            </button>

            {/* Cart Icon */}
            <button className="relative">
              <svg className="w-6 h-6 text-[var(--green)] hover:text-[var(--green-dark)] transition"
                   fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 3h1.386a1.5 1.5 0 011.44 1.1l.5 2.1M7.5 14.25h9.75m-9.75 0l-1.5-9h13.5l-1.5 9m-9.75 0l-.75 4.5m10.5-4.5l.75 4.5m-11.25 0h11.25"/>
              </svg>

              <span className="absolute -top-2 -right-2 bg-[var(--green)] text-white text-xs px-1.5 py-0.5 rounded-full">
                0
              </span>
            </button>

          </nav>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden text-[var(--green)]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE NAV */}
        <div
          className={`md:hidden transition-all duration-300 bg-white border-t ${
            open ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-6 space-y-4 text-[var(--green)] text-lg">

            <Link href="/" onClick={() => setOpen(false)} className="block">
              Home
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} className="block">
              About
            </Link>
            <Link href="/categories" onClick={() => setOpen(false)} className="block">
              Categories
            </Link>

            <hr className="border-gray-200" />

            {/* Mobile Actions */}
            <div className="flex items-center gap-6">

              <button className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"/>
                </svg>
                Profile
              </button>

              <button className="relative flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                     viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.25 3h1.386a1.5 1.5 0 011.44 1.1l.5 2.1M7.5 14.25h9.75m-9.75 0l-1.5-9h13.5l-1.5 9m-9.75 0l-.75 4.5m10.5-4.5l.75 4.5m-11.25 0h11.25"/>
                </svg>
                Cart
                <span className="absolute -top-2 -right-3 bg-[var(--green)] text-white text-xs px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 pb-16">{children}</main>

      {/* FOOTER */}
      <footer className="border-t mt-12 py-8 text-center text-sm text-neutral">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-3">
            © {new Date().getFullYear()} The Find 7 — All rights reserved.
          </div>
          <div>
            <Link href="/privacy" className="mx-2 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="mx-2 hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="mx-2 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}