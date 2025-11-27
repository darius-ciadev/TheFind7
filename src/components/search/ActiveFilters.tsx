"use client";

interface Filters {
  category: string | null;
  price: string | null;
  sortBy: string | null;
  tier: string | null;
}

export default function ActiveFilters({
  filters,
  onClearOne,
  onClearAll,
}: {
  filters: Filters;
  onClearOne: (key: string) => void;
  onClearAll: () => void;
}) {
  const pills = [];

  // CATEGORY
  if (filters.category) {
    pills.push({
      key: "category",
      label: `Category: ${filters.category.replace(/_/g, " ")}`,
    });
  }

  // PRICE
  if (filters.price) {
    const map = {
      budget: "Budget ($ - $$)",
      mid: "Mid-range ($$ - $$$)",
      premium: "Premium ($$$$)",
    };
    pills.push({
      key: "price",
      label: `Price: ${map[filters.price as keyof typeof map] || filters.price}`,
    });
  }

  // SORT
  if (filters.sortBy && filters.sortBy !== "relevance") {
    const sortMap = {
      relevance: "Relevance",
      price_low: "Price: Low → High",
      price_high: "Price: High → Low",
      rating: "Rating",
    };
    pills.push({
      key: "sortBy",
      label: sortMap[filters.sortBy as keyof typeof sortMap] || "Unknown Sort Option", 
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 animate-fadeInSm">
      
      {pills.map((p) => (
        <button
          key={p.key}
          className="
            group flex items-center gap-2 pl-4 pr-3 py-1.5 rounded-full text-sm font-medium 
            bg-black text-white shadow hover:opacity-90 transition-all
          "
          onClick={() => onClearOne(p.key)}
        >
          {p.label}

          {/* Close Icon */}
          <span
            className="
              text-white text-[13px] font-bold
              opacity-80 group-hover:opacity-100 transition
            "
          >
            ✕
          </span>
        </button>
      ))}

      {/* CLEAR ALL BUTTON */}
      <button
        onClick={onClearAll}
        className="text-sm font-medium text-black/60 hover:text-black underline underline-offset-2 ml-3 transition"
      >
        Clear All
      </button>
    </div>
  );
}