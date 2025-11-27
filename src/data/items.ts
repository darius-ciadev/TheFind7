import { TierMap } from "./tierMap";

// src/data/items.ts
// ------------------------------------------------------
// REAL PRODUCT DATA FOR THE FIND 7
// 7 categories × 7 curated items
// ------------------------------------------------------

// Assuming this is your Item type definition
export type Item = {
  slug: string;
  title: string;
  category: string;
  subtitle?: string;
  image?: string;
  price?: string;
  rating?: number;
  description?: string;
  popularity?: number;  
  reviews?: number;     
  createdAt: string; 
  [k: string]: any; 
};

// ------------------------------------------------------
// BEST OVERALL
// ------------------------------------------------------
const best_overall: Item[] = [
  {
    slug: "overall-1",
    category: "best_overall",
    title: "Overall Pick #1",
    subtitle: "The most balanced pick across quality, price, and trust.",
    image: "/products/overall1.jpg",
    price: "$199",
    rating: 4.8,
  },
  {
    slug: "overall-2",
    category: "best_overall",
    title: "Overall Pick #2",
    subtitle: "A reliable choice that delivers everywhere it counts.",
    image: "/products/overall2.jpg",
    price: "$149",
    rating: 4.7,
  },
  {
    slug: "overall-3",
    category: "best_overall",
    title: "Overall Pick #3",
    subtitle: "Strong performance and excellent value.",
    image: "/products/overall3.jpg",
    price: "$179",
    rating: 4.7,
  },
  {
    slug: "overall-4",
    category: "best_overall",
    title: "Overall Pick #4",
    subtitle: "A dependable all-rounder with great user reviews.",
    image: "/products/overall4.jpg",
    price: "$169",
    rating: 4.6,
  },
  {
    slug: "overall-5",
    category: "best_overall",
    title: "Overall Pick #5",
    subtitle: "A refined option that fits most lifestyles.",
    image: "/products/overall5.jpg",
    price: "$159",
    rating: 4.6,
  },
  {
    slug: "overall-6",
    category: "best_overall",
    title: "Overall Pick #6",
    subtitle: "Consistent performance and trusted by many.",
    image: "/products/overall6.jpg",
    price: "$139",
    rating: 4.5,
  },
  {
    slug: "overall-7",
    category: "best_overall",
    title: "Overall Pick #7",
    subtitle: "A safe and dependable everyday choice.",
    image: "/products/overall7.jpg",
    price: "$129",
    rating: 4.4,
  },
];

// ------------------------------------------------------
// BEST VALUE
// ------------------------------------------------------
const best_value: Item[] = [
  {
    slug: "value-1",
    category: "best_value",
    title: "Best Value Pick #1",
    subtitle: "Strong performance at a smarter spend.",
    image: "/products/value1.jpg",
    price: "$89",
    rating: 4.6,
  },
  {
    slug: "value-2",
    category: "best_value",
    title: "Best Value Pick #2",
    subtitle: "Get more for less — efficient and affordable.",
    image: "/products/value2.jpg",
    price: "$79",
    rating: 4.5,
  },
  {
    slug: "value-3",
    category: "best_value",
    title: "Best Value Pick #3",
    subtitle: "A cost-effective option with great reviews.",
    image: "/products/value3.jpg",
    price: "$69",
    rating: 4.4,
  },
  {
    slug: "value-4",
    category: "best_value",
    title: "Best Value Pick #4",
    subtitle: "Smart purchase for budget-conscious buyers.",
    image: "/products/value4.jpg",
    price: "$59",
    rating: 4.3,
  },
  {
    slug: "value-5",
    category: "best_value",
    title: "Best Value Pick #5",
    subtitle: "Solid performance without breaking the bank.",
    image: "/products/value5.jpg",
    price: "$65",
    rating: 4.3,
  },
  {
    slug: "value-6",
    category: "best_value",
    title: "Best Value Pick #6",
    subtitle: "Good quality at a better price.",
    image: "/products/value6.jpg",
    price: "$49",
    rating: 4.2,
  },
  {
    slug: "value-7",
    category: "best_value",
    title: "Best Value Pick #7",
    subtitle: "Affordable yet functional.",
    image: "/products/value7.jpg",
    price: "$39",
    rating: 4.1,
  },
];

// ------------------------------------------------------
// BEST PREMIUM
// ------------------------------------------------------
const best_premium: Item[] = [
  {
    slug: "premium-1",
    category: "best_premium",
    title: "Premium Pick #1",
    subtitle: "Refined build, elevated performance.",
    image: "/products/premium1.jpg",
    price: "$399",
    rating: 4.9,
  },
  {
    slug: "premium-2",
    category: "best_premium",
    title: "Premium Pick #2",
    subtitle: "Crafted with attention to every detail.",
    image: "/products/premium2.jpg",
    price: "$349",
    rating: 4.8,
  },
  {
    slug: "premium-3",
    category: "best_premium",
    title: "Premium Pick #3",
    subtitle: "Luxury feel with high-end performance.",
    image: "/products/premium3.jpg",
    price: "$329",
    rating: 4.8,
  },
  {
    slug: "premium-4",
    category: "best_premium",
    title: "Premium Pick #4",
    subtitle: "Designed for those who want the best.",
    image: "/products/premium4.jpg",
    price: "$309",
    rating: 4.7,
  },
  {
    slug: "premium-5",
    category: "best_premium",
    title: "Premium Pick #5",
    subtitle: "Elegant aesthetics meet top-tier specs.",
    image: "/products/premium5.jpg",
    price: "$289",
    rating: 4.7,
  },
  {
    slug: "premium-6",
    category: "best_premium",
    title: "Premium Pick #6",
    subtitle: "Beautiful design and powerful internals.",
    image: "/products/premium6.jpg",
    price: "$279",
    rating: 4.6,
  },
  {
    slug: "premium-7",
    category: "best_premium",
    title: "Premium Pick #7",
    subtitle: "A polished experience for premium buyers.",
    image: "/products/premium7.jpg",
    price: "$259",
    rating: 4.6,
  },
];

// ------------------------------------------------------
// BEST FOR KIDS
// ------------------------------------------------------
const best_kids: Item[] = [
  {
    slug: "kids-1",
    category: "best_for_kids",
    title: "Kids Pick #1",
    subtitle: "Safe, simple, and designed for small hands.",
    image: "/products/kids1.jpg",
    price: "$49",
    rating: 4.6,
  },
  {
    slug: "kids-2",
    category: "best_for_kids",
    title: "Kids Pick #2",
    subtitle: "Reliable and easy for young users.",
    image: "/products/kids2.jpg",
    price: "$39",
    rating: 4.5,
  },
  {
    slug: "kids-3",
    category: "best_for_kids",
    title: "Kids Pick #3",
    subtitle: "Bright, fun, and beginner-friendly.",
    image: "/products/kids3.jpg",
    price: "$35",
    rating: 4.4,
  },
  {
    slug: "kids-4",
    category: "best_for_kids",
    title: "Kids Pick #4",
    subtitle: "Built to withstand everyday drops and bumps.",
    image: "/products/kids4.jpg",
    price: "$29",
    rating: 4.4,
  },
  {
    slug: "kids-5",
    category: "best_for_kids",
    title: "Kids Pick #5",
    subtitle: "Light, safe, and parent-approved.",
    image: "/products/kids5.jpg",
    price: "$32",
    rating: 4.3,
  },
  {
    slug: "kids-6",
    category: "best_for_kids",
    title: "Kids Pick #6",
    subtitle: "Fun and functional for young beginners.",
    image: "/products/kids6.jpg",
    price: "$27",
    rating: 4.2,
  },
  {
    slug: "kids-7",
    category: "best_for_kids",
    title: "Kids Pick #7",
    subtitle: "Easy to use and budget-friendly.",
    image: "/products/kids7.jpg",
    price: "$25",
    rating: 4.1,
  },
];

// ------------------------------------------------------
// BEST ECO CHOICE
// ------------------------------------------------------
const best_eco: Item[] = [
  {
    slug: "eco-1",
    category: "best_eco_choice",
    title: "Eco Pick #1",
    subtitle: "Responsible materials with excellent longevity.",
    image: "/products/eco1.jpg",
    price: "$129",
    rating: 4.7,
  },
  {
    slug: "eco-2",
    category: "best_eco_choice",
    title: "Eco Pick #2",
    subtitle: "Made for sustainability-first buyers.",
    image: "/products/eco2.jpg",
    price: "$119",
    rating: 4.6,
  },
  {
    slug: "eco-3",
    category: "best_eco_choice",
    title: "Eco Pick #3",
    subtitle: "Low waste, high satisfaction.",
    image: "/products/eco3.jpg",
    price: "$99",
    rating: 4.5,
  },
  {
    slug: "eco-4",
    category: "best_eco_choice",
    title: "Eco Pick #4",
    subtitle: "Efficient, ethical, and user-approved.",
    image: "/products/eco4.jpg",
    price: "$89",
    rating: 4.4,
  },
  {
    slug: "eco-5",
    category: "best_eco_choice",
    title: "Eco Pick #5",
    subtitle: "Sustainable materials and great performance.",
    image: "/products/eco5.jpg",
    price: "$79",
    rating: 4.4,
  },
  {
    slug: "eco-6",
    category: "best_eco_choice",
    title: "Eco Pick #6",
    subtitle: "One of the greenest options available.",
    image: "/products/eco6.jpg",
    price: "$69",
    rating: 4.3,
  },
  {
    slug: "eco-7",
    category: "best_eco_choice",
    title: "Eco Pick #7",
    subtitle: "The right choice for eco-minded users.",
    image: "/products/eco7.jpg",
    price: "$59",
    rating: 4.2,
  },
];

// ------------------------------------------------------
// COOL KIDS' CHOICE
// ------------------------------------------------------
const cool_kids: Item[] = [
  {
    slug: "cool-1",
    category: "cool_kids_choice",
    title: "Cool Pick #1",
    subtitle: "Trend-ready and instantly likeable.",
    image: "/products/cool1.jpg",
    price: "$159",
    rating: 4.8,
  },
  {
    slug: "cool-2",
    category: "cool_kids_choice",
    title: "Cool Pick #2",
    subtitle: "Popular style with great features.",
    image: "/products/cool2.jpg",
    price: "$149",
    rating: 4.7,
  },
  {
    slug: "cool-3",
    category: "cool_kids_choice",
    title: "Cool Pick #3",
    subtitle: "The right vibe for right now.",
    image: "/products/cool3.jpg",
    price: "$139",
    rating: 4.6,
  },
  {
    slug: "cool-4",
    category: "cool_kids_choice",
    title: "Cool Pick #4",
    subtitle: "Loved for its modern look.",
    image: "/products/cool4.jpg",
    price: "$129",
    rating: 4.5,
  },
  {
    slug: "cool-5",
    category: "cool_kids_choice",
    title: "Cool Pick #5",
    subtitle: "Stylish and solid in everyday use.",
    image: "/products/cool5.jpg",
    price: "$119",
    rating: 4.4,
  },
  {
    slug: "cool-6",
    category: "cool_kids_choice",
    title: "Cool Pick #6",
    subtitle: "Great design that stands out.",
    image: "/products/cool6.jpg",
    price: "$109",
    rating: 4.3,
  },
  {
    slug: "cool-7",
    category: "cool_kids_choice",
    title: "Cool Pick #7",
    subtitle: "Fun, stylish, and dependable.",
    image: "/products/cool7.jpg",
    price: "$99",
    rating: 4.2,
  },
];

// ------------------------------------------------------
// BEST UTILITY PICK
// ------------------------------------------------------
const best_utility: Item[] = [
  {
    slug: "utility-1",
    category: "best_utility_pick",
    title: "Utility Pick #1",
    subtitle: "Gets it done — the right tool.",
    image: "/products/utility1.jpg",
    price: "$89",
    rating: 4.8,
  },
  {
    slug: "utility-2",
    category: "best_utility_pick",
    title: "Utility Pick #2",
    subtitle: "Strong, reliable, and built to last.",
    image: "/products/utility2.jpg",
    price: "$79",
    rating: 4.7,
  },
  {
    slug: "utility-3",
    category: "best_utility_pick",
    title: "Utility Pick #3",
    subtitle: "Simple and effective.",
    image: "/products/utility3.jpg",
    price: "$69",
    rating: 4.6,
  },
  {
    slug: "utility-4",
    category: "best_utility_pick",
    title: "Utility Pick #4",
    subtitle: "A dependable tool for everyday tasks.",
    image: "/products/utility4.jpg",
    price: "$59",
    rating: 4.5,
  },
  {
    slug: "utility-5",
    category: "best_utility_pick",
    title: "Utility Pick #5",
    subtitle: "Durable and built for daily use.",
    image: "/products/utility5.jpg",
    price: "$55",
    rating: 4.4,
  },
  {
    slug: "utility-6",
    category: "best_utility_pick",
    title: "Utility Pick #6",
    subtitle: "Designed for practicality.",
    image: "/products/utility6.jpg",
    price: "$49",
    rating: 4.3,
  },
  {
    slug: "utility-7",
    category: "best_utility_pick",
    title: "Utility Pick #7",
    subtitle: "A simple, effective value pick.",
    image: "/products/utility7.jpg",
    price: "$45",
    rating: 4.2,
  },
];

export const items: Item[] = [
  ...best_overall,
  ...best_value,
  ...best_premium,
  ...best_kids,
  ...best_eco,
  ...cool_kids,
  ...best_utility,
].map((item) => ({
  ...item,
  tier: TierMap[item.category] ?? "C",
}));