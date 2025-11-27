/** Convert DB key → URL slug */
export function categoryToSlug(key: string) {
  return key.replace(/_/g, "-");
}

/** Convert URL slug → DB key */
export function slugToCategory(slug: string) {
  return slug.replace(/-/g, "_");
}

/** Build URL for Item pages */
export function itemUrl(categoryKey: string, slug: string) {
  return `/${categoryToSlug(categoryKey)}/${slug}`;
}
