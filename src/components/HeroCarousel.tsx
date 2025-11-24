"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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
  const [progressKey, setProgressKey] = useState(0);
  const touchStart = useRef<number | null>(null);

  const SLIDE_DURATION = 5500;

  /* -------------------------------------------------------
   * AUTO-ROTATE
   * ----------------------------------------------------- */
  useEffect(() => {
    const i = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION);
    return () => clearInterval(i);
  }, []);

  /* -------------------------------------------------------
   * KEYBOARD NAVIGATION (← / →)
   * ----------------------------------------------------- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrent((p) => (p - 1 + slides.length) % slides.length);
        setProgressKey((k) => k + 1);
      }
      if (e.key === "ArrowRight") {
        setCurrent((p) => (p + 1) % slides.length);
        setProgressKey((k) => k + 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* -------------------------------------------------------
   * SWIPE / TOUCH CONTROLS
   * ----------------------------------------------------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (delta > 60) {
      setCurrent((p) => (p - 1 + slides.length) % slides.length);
      setProgressKey((k) => k + 1);
    } else if (delta < -60) {
      setCurrent((p) => (p + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }
    touchStart.current = null;
  };

  /* helper: prefers-reduced-motion */
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden rounded-2xl mb-16"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {slides.map((slide, index) => {
        const isActive = index === current;

        /**
         * Depth blur effect:
         * - active: sharp, scale ~1.00, blur 0px, z-10
         * - inactive: slightly scaled up (scale 1.08), translateY small, blur 4px, z-0
         *
         * We animate via CSS transitions on filter + transform + opacity.
         * If user prefers reduced motion, we minimize transitions and disable scale/translate.
         */
        const inactiveStyle: React.CSSProperties = prefersReducedMotion
          ? { filter: "blur(0px)", transform: "none" }
          : { filter: "blur(4px) brightness(0.85)", transform: "scale(1.08) translateY(12px)" };

        const activeStyle: React.CSSProperties = prefersReducedMotion
          ? { filter: "none", transform: "none" }
          : { filter: "blur(0px) brightness(1)", transform: "scale(1) translateY(0px)" };

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            {/* Background image container with transition on filter/transform */}
            <div
              style={isActive ? activeStyle : inactiveStyle}
              className="absolute inset-0 will-change-transform will-change-filter transition-[filter,transform,opacity] duration-[1400ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            >
              <Image
                src={`${slide.image}?auto=format&fit=crop&w=2000&q=80`}
                alt={slide.title}
                fill
                priority={isActive}
                sizes="100vw"
                className="object-cover"
                style={{
                  // subtle parallax on the image element itself
                  transform: isActive ? "translateY(0px)" : "translateY(8px)",
                  transition: prefersReducedMotion ? "none" : "transform 1400ms cubic-bezier(0.25,0.1,0.25,1)",
                }}
              />
            </div>

            {/* Overlay to deepen depth and keep text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/44 via-black/24 to-transparent" />

            {/* Text block */}
            <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-20 max-w-2xl text-white">
              <h1
                className={`text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-2xl transition-all duration-700 ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {slide.title}
              </h1>

              <p
                className={`text-lg md:text-2xl mb-8 opacity-90 drop-shadow transition-all duration-700 delay-150 ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {slide.subtitle}
              </p>

              <Link
                href={slide.href}
                className={`inline-block px-7 py-3 rounded-lg bg-[var(--green)] text-white font-semibold shadow-lg transition-all duration-300 hover:bg-[var(--green-dark)] ${
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
                aria-hidden={!isActive}
              >
                {slide.cta} →
              </Link>
            </div>
          </div>
        );
      })}

      {/* Dots + Progress Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-xs">
        <div className="flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => {
                setCurrent(i);
                setProgressKey((k) => k + 1);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                i === current ? "bg-white scale-125 shadow" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div
            key={progressKey}
            className="h-full bg-white rounded-full"
            style={{
              animation: `fillBar ${SLIDE_DURATION}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fillBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        /* Slightly reduce blur on very small devices for performance */
        @media (max-width: 640px) {
          div[style*='blur(4px)'] {
            filter: blur(2px) !important;
          }
        }
      `}</style>
    </section>
  );
}