"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import ItemCard from "@/components/ItemCard";

interface TopPicksCarouselProps<T> {
  items: T[];
}

export default function TopPicksCarousel<T>({ items }: TopPicksCarouselProps<T>) {
  const [emblaRef, embla] = useEmblaCarousel(
    {
      align: "start",
      loop: false,
      dragFree: true,
    },
    [
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
    onSelect();
  }, [embla, onSelect]);

  return (
    <div className="relative w-full">

      {/* ========================================== */}
      {/* MOBILE CAROUSEL — Enhanced                */}
      {/* ========================================== */}
      <div className="block md:hidden relative">

        {/* LEFT FADE */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-20" />

        {/* RIGHT FADE */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-20" />

        {/* EMBLA VIEWPORT */}
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-5 py-4 pl-2 pr-8">
            {items.map((item: any, index: number) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-[0_0_85%] sm:flex-[0_0_70%]"
              >
                <ItemCard {...item} rank={index + 1} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ARROWS */}
        <button
          onClick={() => embla?.scrollPrev()}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 
          bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg 
          hover:shadow-xl hover:scale-110 transition"
        >
          ‹
        </button>

        <button
          onClick={() => embla?.scrollNext()}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 
          bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg 
          hover:shadow-xl hover:scale-110 transition"
        >
          ›
        </button>

        {/* PAGINATION */}
        <div className="flex justify-center mt-4 gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => embla?.scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition 
                ${i === selectedIndex ? "bg-[var(--green)] scale-[1.45]" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* DESKTOP GRID — PREMIUM UPGRADE            */}
      {/* ========================================== */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 pt-4">

        {items.map((item: any, index: number) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.12 }}
            className="
              transition-all 
              hover:-translate-y-2 
              rounded-2xl
            "
          >
            <ItemCard {...item} rank={index + 1} />
          </motion.div>
        ))}

      </div>
    </div>
  );
}
