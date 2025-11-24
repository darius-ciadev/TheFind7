"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-white via-neutral-50 to-white">
      <div
        className="
          max-w-7xl mx-auto
          px-8 md:px-16 lg:px-32
          pt-20 md:pt-28 pb-10
          grid grid-cols-1 md:grid-cols-2
          gap-16 items-center
        "
      >
        {/* LEFT — TEXT */}
        <div className="space-y-6">
          <h1
            className="
              font-extrabold text-gray-900
              text-5xl md:text-6xl lg:text-7xl
              leading-[1.05]
            "
          >
            Make your next
            <br />
            choice effortless.
          </h1>

          <p
            className="
              text-lg md:text-xl text-neutral-600
              max-w-xl
            "
          >
            We turn thousands of products into 7 perfect choices.
          </p>

          <Link
            href="/categories"
            className="
              inline-block
              px-10 py-4
              rounded-full
              bg-[var(--green)] text-white
              text-lg font-semibold
              shadow-md hover:shadow-lg
              hover:bg-[var(--green-dark)]
              transition-all duration-300
            "
          >
            Start here →
          </Link>
        </div>

        {/* RIGHT — IMAGE */}
        <div
          className="
            relative w-full
            aspect-[4/3] md:aspect-square lg:aspect-[5/4]
          "
        >
          <div
            className="
              absolute inset-0
              rounded-3xl
              overflow-hidden
              shadow-[0_12px_32px_rgba(0,0,0,0.12)]
              rotate-[1.5deg]
            "
          >
            <Image
              src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1400&q=80'
              alt="Polaroid Camera"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}