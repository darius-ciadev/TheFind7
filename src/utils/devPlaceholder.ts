export function devPlaceholder(image?: string) {
  if (!image || typeof image !== "string" || image.trim() === "") {
    return "/placeholder.png";
  }

  return "/placeholder.png";
}