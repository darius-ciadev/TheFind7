import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

// NOTE: the following local path will be transformed into a usable URL by the build/deployment step.
// If you want to use a public asset instead, move the file into /public and update the path accordingly.
const logoUrl = "/brand/logo_dark_512.png"; // fallback public path
// local uploaded file path (for tooling): /mnt/data/A_digital_placeholder_image_features_a_light_gray_.png

type Props = {
  children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-body">
      <header className="w-full border-b bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">
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

          <nav className="hidden md:flex gap-8 text-lg font-medium text-[var(--green)]">
            <Link
              href="/"
              className="hover:text-[var(--green-dark)] transition"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-[var(--green-dark)] transition"
            >
              About
            </Link>
            <Link
              href="/categories"
              className="hover:text-[var(--green-dark)] transition"
            >
              Categories
            </Link>
          </nav>

          <div className="md:hidden text-3xl text-[var(--green)]">☰</div>
        </div>
      </header>

      <main className="flex-1 pt-8 pb-16">{children}</main>

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
