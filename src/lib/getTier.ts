// src/lib/getTier.ts
export function getTier(item: any): "S" | "A" | "B" | "C" {
  const t = `${item.category || ""} ${item.slug || ""}`.toLowerCase();

  if (t.includes("best_premium")) return "S";
  if (t.includes("best_overall")) return "A";

  if (
    t.includes("best_value") ||
    t.includes("best_eco_choice") ||
    t.includes("best_utility_pick")
  ) {
    return "B";
  }

  if (t.includes("best_for_kids") || t.includes("kids") || t.includes("cool_kids")) {
    return "C";
  }

  return "C";
}
