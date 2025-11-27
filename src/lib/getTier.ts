// src/lib/getTier.ts

export function getTier(item: any): "S" | "A" | "B" | "C" {
  const cat = item.category?.toLowerCase() || "";
  const slug = item.slug?.toLowerCase() || "";
  const text = `${cat} ${slug}`;

  if (text.includes("best_premium")) return "S";

  if (text.includes("best_overall")) return "A";

  if (
    text.includes("best_value") ||
    text.includes("best_eco_choice") ||
    text.includes("best_utility_pick")
  )
    return "B";

  if (
    text.includes("best_for_kids") ||
    text.includes("cool_kids_choice")
  )
    return "C";

  return "C";
}