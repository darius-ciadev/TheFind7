export function getTierIcon(tier: string) {
  const map: Record<string, string> = {
    S: "💎",
    A: "🔥",
    B: "⭐",
    C: "⚪",
  };
  return map[tier] ?? "⚪";
}
