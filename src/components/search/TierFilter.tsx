import { useSearchContext } from "@/hooks/useSearchContext";

export function TierSection() {
  const { filters, setFilters } = useSearchContext();
  const tiers = ["S", "A", "B", "C"];

  function toggleTier(tier: string) {
    setFilters((prev) => ({
      ...prev,
      tier: prev.tier === tier ? null : tier,
    }));
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">Tier Rating</h4>

      <div className="flex gap-2 flex-wrap">
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => toggleTier(t)}
            className={`
              px-3 py-1 rounded-md text-sm font-bold border transition-all
              ${filters.tier === t 
                ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(180,60,255,0.8)] scale-[1.05]"
                : "bg-gray-100 text-gray-700 hover:bg-purple-200"
              }
            `}
          >
            Tier {t}
          </button>
        ))}
      </div>
    </div>
  );
}
