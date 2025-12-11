export function formatNumber(n: number | string) {
  if (n === null || n === undefined) return "";
  const num = Number(n);
  return isNaN(num) ? "" : num.toLocaleString();
}
