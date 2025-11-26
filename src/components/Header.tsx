"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">
        
        {/* Logo */}
        {/* <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/the_find_7_logo.svg"
            alt="The Find7 Logo"
            width={42}
            height={42}
            priority
          />
          <span className="text-2xl font-extrabold tracking-tight">
            The Find 7
          </span>
        </Link> */}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 text-lg font-medium text-teal-700">
          {/* <Link className="hover:text-teal-900 transition" href="/">Home</Link>
          <Link className="hover:text-teal-900 transition" href="/about">About</Link>
          <Link className="hover:text-teal-900 transition" href="/categories">Categories</Link> */}

          {/* Search */}
          <div className="relative">
            <svg
              className="w-5 h-5 absolute left-3 top-2 text-gray-500"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.65 6.15z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-3 py-1 rounded-md border border-gray-300 text-base focus:outline-teal-600"
              onChange={(e) => console.log("Search:", e.target.value)}
            />
          </div>

          {/* Profile + Cart */}
          <div className="flex items-center gap-4 ml-2 text-teal-700">

            {/* Profile */}
            <button aria-label="Profile">
              <svg
                className="w-6 h-6 hover:text-teal-900 transition"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
                />
              </svg>
            </button>

            {/* Cart */}
            <button aria-label="Cart" className="relative">
              <svg
                className="w-6 h-6 hover:text-teal-900 transition"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.25 3h1.386a1.5 1.5 0 011.44 1.1l.5 2.1M7.5 14.25h9.75m-9.75 0l-1.5-9h13.5l-1.5 9m-9.75 0l-.75 4.5m10.5-4.5l.75 4.5m-11.25 0h11.25"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                0
              </span>
            </button>

          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-teal-700"
          aria-label="Toggle navigation"
        >
          {open ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`
          md:hidden transition-all duration-300 bg-white border-t border-gray-200
          ${open ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"}
        `}
      >
        <div className="px-6 space-y-4 text-teal-700 text-lg">

          {/* Search Mobile */}
          <div className="relative">
            <svg
              className="w-5 h-5 absolute left-3 top-3 text-gray-500"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.65 6.15z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 text-base focus:outline-teal-600"
              onChange={(e) => console.log("Search:", e.target.value)}
            />
          </div>

          <Link href="/" onClick={() => setOpen(false)} className="block">Home</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block">About</Link>
          <Link href="/categories" onClick={() => setOpen(false)} className="block">Categories</Link>

          {/* Mobile Icons */}
          <div className="flex items-center gap-6 pt-2">
            <button className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
                />
              </svg>
              Profile
            </button>

            <button className="relative flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.25 3h1.386a1.5 1.5 0 011.44 1.1l.5 2.1M7.5 14.25h9.75m-9.75 0l-1.5-9h13.5l-1.5 9m-9.75 0l-.75 4.5m10.5-4.5l.75 4.5m-11.25 0h11.25"
                />
              </svg>
              Cart
              <span className="absolute -top-2 -right-3 bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                0
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}