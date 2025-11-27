// src/data/tierMap.ts
// ------------------------------------------------------
// Tier mapping for categories → S/A/B/C
// ------------------------------------------------------

export const TierMap: Record<string, "S" | "A" | "B" | "C"> = {
  // 🔥 Premium / High-end
  best_premium: "S",

  // ⭐ Best overall
  best_overall: "A",

  // 💰 Best value
  best_value: "B",

  // 🌱 Eco picks
  best_eco_choice: "B",

  // 🎒 Kids options
  best_for_kids: "C",
  cool_kids_choice: "C",

  // 🧰 Utility picks
  best_utility_pick: "B",
};