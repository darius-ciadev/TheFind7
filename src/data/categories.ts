import schema from "./label_schema.override.json";

export interface Category {
    key: string;
    name: string;
    tagline: string;
    emoji: string;
    slug: string;
}

export const categories: Category[] = schema.labels.map((c: any) => ({
    key: c.key,
    name: c.name,
    tagline: c.tagline,
    emoji: c.emoji || c.icon || "",
    slug: (c.key || "").replace(/_/g, "-"),
}));
