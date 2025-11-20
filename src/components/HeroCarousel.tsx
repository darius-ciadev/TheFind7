import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    title: "Find the right one.",
    subtitle: "Seven curated picks. One perfect match.",
    cta: "Browse categories",
    href: "#categories",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    title: "Smarter comparisons.",
    subtitle: "We turn thousands of products into 7 perfect choices.",
    cta: "Explore top lists",
    href: "#categories",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    title: "Curated by experts.",
    subtitle: "Performance, value, trust — distilled into 7 picks.",
    cta: "See recommendations",
    href: "#categories",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    title: "Make your next choice effortless.",
    subtitle: "Search less. Find more.",
    cta: "Start here",
    href: "#categories",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden rounded-2xl mb-16">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === current;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transform transition-all duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isActive
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <Image
              src={`${slide.image}?auto=format&fit=crop&w=2000&q=80`}
              alt={slide.title}
              fill
              className="object-cover"
              priority={isActive}
              sizes="100vw"
            />

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

            {/* Text */}
            <div className="absolute inset-0 flex flex-col justify-center md:justify-end px-8 md:px-16 pb-16 md:pb-24 max-w-xl text-white">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-xl">
                {slide.title}
              </h1>

              <p className="text-lg md:text-2xl mb-6 opacity-90 drop-shadow-lg">
                {slide.subtitle}
              </p>

              <Link
                href={slide.href}
                className="inline-block bg-[var(--green)] text-white px-7 py-3 rounded-lg font-semibold hover:bg-[var(--green-dark)] transition shadow-lg"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        );
      })}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current
                ? "bg-white scale-125 shadow"
                : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}