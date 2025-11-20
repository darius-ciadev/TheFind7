import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">
        
        {/* Logo + Title */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo_dark_512.png"
            alt="The Find7"
            width={42}
            height={42}
            priority
          />
          <span className="text-2xl font-extrabold tracking-tight">
            The Find 7
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-10 text-lg font-medium text-teal-700">
          <Link className="hover:text-teal-900 transition" href="/">Home</Link>
          <Link className="hover:text-teal-900 transition" href="/about">About</Link>
          <Link className="hover:text-teal-900 transition" href="/categories">Categories</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl text-teal-700"
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-4 text-teal-700 text-lg">
          <Link href="/" onClick={() => setOpen(false)} className="block">Home</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block">About</Link>
          <Link href="/categories" onClick={() => setOpen(false)} className="block">Categories</Link>
        </div>
      )}
    </header>
  );
}