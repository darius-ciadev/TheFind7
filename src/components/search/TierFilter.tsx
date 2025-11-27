import useSearchState from "@/hooks/useSearchState";

export function TierSection() {
  // Destructure tier and setTier directly from useSearchState
  const { tier, setTier } = useSearchState();
  
  const tiers = ["S", "A", "B", "C"];

  // Function to toggle the selected tier
  function toggleTier(tier: string) {
    setTier((prevTier) => (prevTier === tier ? null : tier)); // Toggle between the tier or null
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">Tier Rating</h4>

      <div className="flex gap-2 flex-wrap">
        {tiers.map((t) => (
          <button
            key={t}
            onClick={() => toggleTier(t)} // Toggle the tier selection on click
            className={`px-3 py-1 rounded-md text-sm font-bold border transition-all
              ${tier === t
                ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(180,60,255,0.8)] scale-[1.05]"
                : "bg-gray-100 text-gray-700 hover:bg-purple-200"
              }`}
          >
            Tier {t}
          </button>
        ))}
      </div>
    </div>
  );
}
