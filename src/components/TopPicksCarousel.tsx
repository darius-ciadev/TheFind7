"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useCallback } from "react";
import ItemCard from "@/components/ItemCard";

interface TopPicksCarouselProps {
  items: string;
}

export default function TopPicksCarousel({ items }: TopPicksCarouselProps) {
  const [emblaRef, embla] = useEmblaCarousel(
    {
      align: "start",
      loop: false,
      dragFree: true,
      skipSnaps: false,
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
  const [scrollSnaps, setScrollSnaps] = useState([]);

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

      {/* Left Fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 
        bg-gradient-to-r from-white/95 to-transparent z-20" />

      {/* Right Fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 
        bg-gradient-to-l from-white/95 to-transparent z-20" />

      {/* Embla Viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6 py-4 px-1">
          {items.map((item, index) => (
            <div
              key={item.slug}
              className="
                flex-[0_0_90%]
                sm:flex-[0_0_48%]
                lg:flex-[0_0_32%]
                xl:flex-[0_0_25%]
                transition-transform duration-300
                hover:-translate-y-1
              "
            >
              <ItemCard
                rank={index + 1}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                price={item.price}
                rating={item.rating}
                slug={item.slug}
                category={item.category}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={() => embla?.scrollPrev()}
        className="
          absolute left-3 top-1/2 -translate-y-1/2 z-30 
          bg-white p-3 rounded-full shadow-lg 
          hover:shadow-xl hover:scale-110 transition
        "
      >
        <span className="text-xl leading-none">‹</span>
      </button>

      <button
        onClick={() => embla?.scrollNext()}
        className="
          absolute right-3 top-1/2 -translate-y-1/2 z-30 
          bg-white p-3 rounded-full shadow-lg 
          hover:shadow-xl hover:scale-110 transition
        "
      >
        <span className="text-xl leading-none">›</span>
      </button>

      {/* Pagination */}
      <div className="flex justify-center mt-5 gap-2">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            className={`
              w-3 h-3 rounded-full transition 
              ${i === selectedIndex 
                ? "bg-[var(--green)] scale-125" 
                : "bg-gray-300 hover:bg-gray-400"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
