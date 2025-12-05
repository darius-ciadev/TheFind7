"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const logoUrl = "/brand/logo_dark_512.png";

/* -----------------------------
   NavLink (receives active)
----------------------------- */
function NavLink({
  href,
  name,
  active,
  children
}: {
  href: string;
  name: string;
  active: string;
  children: React.ReactNode;
}) {
  const isActive = active === name;

  return (
    <Link
      href={href}
      className={`transition px-1 pb-1 border-b-2 ${
        isActive
          ? "border-[var(--green)] text-[var(--green)]"
          : "border-transparent var(--find7-color-primary) hover:border-[var(--green)] hover:text-[var(--green-dark)]"
      }`}
    >
      {children}
    </Link>
  );
}

/* -----------------------------
   MAIN HEADER COMPONENT
----------------------------- */
export default function Header({
  setSearchOpen
}: {
  setSearchOpen?: (v: boolean) => void;
}) {
  const pathname = usePathname(); // detects current page route
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  /* -------------------------------------
     Detect pages (About, Contact, etc.)
  -------------------------------------- */
  useEffect(() => {
    if (pathname === "/about") setActive("about");
    else if (pathname !== "/") setActive(""); // other pages → no highlight
  }, [pathname]);

  /* -------------------------------------
     Scroll detection ONLY on homepage
  -------------------------------------- */
  useEffect(() => {
    if (pathname !== "/") return; // do NOT run on other pages

    const sections = [
      { id: "hero", name: "home" },
      { id: "browse-categories", name: "categories" }
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sec = sections.find((s) => s.id === entry.target.id);
            if (sec) setActive(sec.name);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="w-full border-b sticky top-0 bg-[var(--find7-color-bg)] z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <Image src={logoUrl} alt="The Find 7" width={42} height={42} priority />
          <span className="text-2xl font-extrabold tracking-tight text-[var(--find7-color-primary)]">
            The Find 7
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium">

          <NavLink href="/" name="home" active={active}>
            Home
          </NavLink>

          <NavLink href="/about" name="about" active={active}>
            About
          </NavLink>

          <NavLink href="/#browse-categories" name="categories" active={active}>
            Categories
          </NavLink>

          {/* Search */}
          <button
            onClick={() => setSearchOpen?.(true)}
            className="hover:text-[var(--green-dark)] text-[var(--find7-color-primary)] transition"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>

          {/* Profile */}
          <button className="hover:text-[var(--green-dark)] text-[var(--find7-color-primary)] transition">
            <UserIcon className="w-6 h-6" />
          </button>

          {/* Cart */}
          <button className="relative hover:text-[var(--green-dark)] text-[var(--find7-color-primary)] transition">
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-[var(--green)] text-white text-xs px-1.5 py-0.5 rounded-full">
              0
            </span>
          </button>
        </nav>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden text-[var(--green)]"
          onClick={() => setOpen(!open)}
        >
          {open ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
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

          <Link href="/#browse-categories" onClick={() => setOpen(false)} className="block">
            Categories
          </Link>

          <hr className="border-gray-200" />

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2">
              <UserIcon className="w-6 h-6" /> Profile
            </button>

            <button className="relative flex items-center gap-2">
              <ShoppingCartIcon className="w-6 h-6" /> Cart
              <span className="absolute -top-2 -right-3 bg-[var(--green)] text-white text-xs px-1.5 py-0.5 rounded-full">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
