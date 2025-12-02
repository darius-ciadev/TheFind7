"use client";
import React, { useState, ReactNode  } from "react";
import Link from "next/link";
import Header from "./Header";
import SearchBar from "@/components/search/SearchBar";

interface SiteLayoutProps {
    children: ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-body">
      {/* Header */}
      <Header setSearchOpen={setSearchOpen} />

      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />

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