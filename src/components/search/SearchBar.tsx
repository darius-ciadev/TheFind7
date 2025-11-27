"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { searchItems } from "@/utils/searchEngine";
import SearchSuggestions from "./SearchSuggestions";

interface SearchBarProps {
  open: boolean;       
  onClose: () => void;
}

type Item = {
  slug: string;
  title: string;
  category: string;
  price: string | undefined;
  rating: number;
  image: string;
};

export default function SearchBar({ open, onClose }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef(null);

  // ---------------------------------------------
  // Load suggestions
  // ---------------------------------------------
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

   const t = setTimeout(() => {
      const results = searchItems(value); // results should now match Item[] type
      setSuggestions(results);           // No more type mismatch
      setActiveIndex(0); 
    }, 180);

    return () => clearTimeout(t);
  }, [value]);

  // ---------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const chosen = suggestions[activeIndex];
      if (chosen) {
        router.push(`/${chosen.category}/${chosen.slug}`);
        onClose();
      }
    }

    if (e.key === "Escape") {
      onClose();
    }
  };

  // ---------------------------------------------
  // Submit handler
  // ---------------------------------------------
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!value.trim()) return;

    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-32 z-[999]">
      <div className="bg-white w-[90%] max-w-xl rounded-xl shadow-xl p-6 relative" ref={containerRef}>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="flex-1 border rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-[var(--green)] outline-none"
          />

          <button
            type="submit"
            className="px-5 bg-[var(--green)] text-white font-semibold rounded-lg hover:bg-[var(--green-dark)] transition"
          >
            Search
          </button>
        </form>

        {/* Suggestions */}
        <div className="absolute left-0 right-0 top-[100%] px-6 pt-2">
          <SearchSuggestions
                items={suggestions}
                query={value}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                onSelect={onClose}
            />
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-neutral-600 hover:underline block"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}