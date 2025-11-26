export function devPlaceholder(image?: string) {
    // In dev we prefer a safe placeholder while real images are not present
    if (!image || image.trim() === "") return "/placeholder.png";
    if (process.env.NODE_ENV === "development") return "/placeholder.png";
    return image;
}