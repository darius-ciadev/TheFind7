"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { devPlaceholder } from "@/utils/devPlaceholder";
import { itemUrl } from "@/utils/urls"; 
import { useRouter } from "next/router";

export default function SearchSuggestions({
  items = [],
  query = "",
  activeIndex,
  setActiveIndex,
  onSelect
}) {
  const router = useRouter();

  if (!query || items.length === 0) return null;

  const containerRef = useRef<HTMLUListElement>(null);

  // Auto-scroll active element into view
  useEffect(() => {
    const list = containerRef.current;
    if (!list) return;

    const active = list.querySelector(`[data-index="${activeIndex}"]`);
    if (active) {
      active.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  // ------- Keyboard Navigation Handler -------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
      }

      if (e.key === "Enter") {
        const item = items[activeIndex];
        if (!item) return;

        // Allow SearchBar to close / navigate
        onSelect?.();

        // Navigate to item
        window.location.href = `/${item.category}/${item.slug}`;
      }

      if (e.key === "Escape") {
        onSelect?.();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [items, activeIndex, setActiveIndex, onSelect]);

  // ------- Highlight helper -------
  const highlight = (text: string) => {
    const q = query.toLowerCase();
    const lower = text.toLowerCase();

    const idx = lower.indexOf(q);
    if (idx === -1) return text;

    return (
      <>
        {text.slice(0, idx)}
        <span className="font-semibold text-[var(--green)]">
          {text.slice(idx, idx + q.length)}
        </span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="mt-3 border rounded-xl bg-white shadow-md overflow-hidden">
      <ul ref={containerRef} className="max-h-72 overflow-y-auto">
        {items.slice(0, 10).map((item, i) => {
          const isActive = i === activeIndex;

          return (
            <li
              key={item.slug}
              data-index={i}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect?.();
                router.push(itemUrl(item.category, item.slug)); // 🚀 INSTANT
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer transition
                ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}
              `}
            >
              <Image
                src={devPlaceholder(item.image)}
                alt={item.title}
                width={48}
                height={48}
                className="rounded-md object-cover bg-gray-200"
              />

              <div>
                <p className="font-medium">{highlight(item.title)}</p>
                <p className="text-xs opacity-70">{highlight(item.category)}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer - view all results */}
      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        onClick={onSelect}
        className="block text-center py-2 bg-gray-50 hover:bg-gray-100 font-medium text-[var(--green)] border-t"
      >
        See all results for “{query}”
      </Link>
    </div>
  );
}