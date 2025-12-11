// src/components/ItemCard.tsx
import { devPlaceholder } from "@/utils/devPlaceholder";
import Image from "next/image";
import Link from "next/link";
import { itemUrl } from "@/utils/urls";
import { useCompare } from "@/hooks/useCompare";
import { motion } from "framer-motion";

export interface ItemCardProps {
  rank: number;
  title: string;
  subtitle: string;
  image?: string;
  price?: string | number;
  rating?: number;
  slug: string;
  category: string;
  viewMode?: "grid" | "list";
  sidebar?: boolean;
}

export default function ItemCard({
  rank,
  title,
  subtitle,
  image,
  price = "$—",
  rating = 4.5,
  slug,
  category,
  viewMode = "grid",
  sidebar,
}: ItemCardProps) {
  const href = itemUrl(category, slug);
  const { toggle, items: compared } = useCompare();
  const isCompared = compared.includes(slug);

  const badgeMap: Record<number, string> = {
    1: "Best Overall",
    2: "Best Value",
    3: "Premium",
  };
  const badge = badgeMap[rank];

  const imgSrc = image ? devPlaceholder(image) : "/placeholder.png";

  /* SIDEBAR COMPACT CARD */
  if (sidebar) {
    return (
      <Link href={href} className="block group">
        <article className="relative bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all">

          <div className="absolute -top-2 -left-2 w-[26px] h-[26px] rounded-full bg-[var(--green)] text-white text-xs font-bold flex items-center justify-center shadow">
            {rank}
          </div>

          <div className="flex gap-3">
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
              <Image src={imgSrc} alt={title} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
              <p className="text-xs text-neutral-600 line-clamp-2">
                {subtitle}
              </p>

              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="flex items-center gap-1 text-neutral-700">
                  ⭐ {rating}
                </div>
                <span className="font-semibold">{price}</span>
              </div>

              <div className="mt-3 flex gap-2">
                <div className="flex-1 bg-[var(--green)] text-white text-center text-xs font-medium py-1 rounded-md">
                  View →
                </div>

                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    toggle(slug);
                  }}
                  whileTap={{ scale: 0.9 }}
                  animate={
                    isCompared
                      ? { scale: [1, 1.06, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.25 }}
                  className={`px-2 py-1 rounded-md border text-xs ${
                    isCompared
                      ? "bg-[var(--green)] text-white border-[var(--green)]"
                      : "hover:bg-neutral-100"
                  }`}
                >
                  {isCompared ? "✓" : "Compare"}
                </motion.button>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  /* LIST MODE */
  if (viewMode === "list") {
    return (
      <Link href={href} className="block group">
        <article className="relative bg-white rounded-xl border p-4 flex items-center gap-5 transition-all duration-200 hover:border-[var(--green)] hover:-translate-y-[2px]">
          <div className="absolute -top-3 -left-3 w-[32px] h-[32px] flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white text-xs font-bold ring-2 ring-white shadow-md">
            {rank}
          </div>

          {badge && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-black/80 backdrop-blur-sm text-white shadow border border-white/10">
              {badge}
            </div>
          )}

          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-100">
            <Image
              src={imgSrc}
              alt={title}
              fill
              priority={rank <= 3}
              sizes="96px"
              className="object-cover transition-all duration-300 group-hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.18)] group-hover:scale-[1.03]"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold leading-tight text-[var(--find7-color-primary)] mb-1 line-clamp-1">
              {title}
            </h3>

            <p className="text-xs text-[var(--find7-color-neutral)] mb-2 line-clamp-2">
              {subtitle}
            </p>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-neutral-700 text-sm">
                ⭐ <span className="text-[13px]">{rating}</span>
              </div>
              <span className="font-medium text-[14px]">{price}</span>
            </div>

            <div className="mt-3 flex gap-2">
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  toggle(slug);
                }}
                whileTap={{ scale: 0.9 }}
                animate={
                  isCompared ? { scale: [1, 1.06, 1] } : { scale: 1 }
                }
                transition={{ duration: 0.25 }}
                className={`px-3 py-1 rounded-md text-sm transition ${
                  isCompared
                    ? "bg-[var(--green)] text-white"
                    : "border hover:bg-neutral-100"
                }`}
              >
                {isCompared ? "Added" : "Compare"}
              </motion.button>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  /* GRID MODE (default) */
  return (
    <Link href={href} className="block group">
      <article className="relative bg-white rounded-2xl border p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_6px_18px_rgba(0,0,0,0.07)] hover:-translate-y-[3px]">
        <div className="absolute -top-3 -left-3 w-[36px] h-[36px] flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white text-sm font-bold ring-2 ring-white shadow-lg z-20">
          {rank}
        </div>

        {badge && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md shadow-md text-[10px] font-semibold uppercase tracking-wide bg-black/80 backdrop-blur-sm text-white border border-white/10 z-20">
            {badge}
          </div>
        )}

        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 mb-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
          <Image
            src={imgSrc}
            alt={title}
            fill
            priority={rank <= 3}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-300 group-hover:shadow-[inset_0_0_10px_rgba(0,0,0,0.18)] group-hover:scale-[1.03]"
          />
        </div>

        <h3 className="text-base font-semibold leading-tight text-[var(--find7-color-primary)] mb-1 line-clamp-1">
          {title}
        </h3>

        <p className="text-xs text-[var(--find7-color-neutral)] mb-2 line-clamp-2">
          {subtitle}
        </p>

        <div className="flex justify-between items-center text-sm mb-4 mt-auto">
          <div className="flex items-center gap-1 text-neutral-700">
            <span aria-hidden="true">⭐</span>
            <span className="text-[13px]">{rating}</span>
          </div>
          <span className="price-main">{price}</span>
        </div>

        <div className="itemcard-cta-wrapper mt-3 flex items-center gap-3">
          <div
            className="
              flex-1 py-2 px-3 rounded-md
              text-center text-sm font-medium
              cursor-pointer whitespace-nowrap
              bg-[var(--green)] text-white
              transition duration-200
              group-hover:bg-[var(--green-dark)]
              group-hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
              hover:-translate-y-[1px]
            "
          >
            View Item →
          </div>

          <motion.button
            onClick={(e) => {
              e.preventDefault();
              toggle(slug);
            }}
            aria-pressed={isCompared}
            whileTap={{ scale: 0.9 }}
            animate={
              isCompared ? { scale: [1, 1.06, 1] } : { scale: 1 }
            }
            transition={{ duration: 0.25 }}
            className={`
              shrink-0 px-3 py-2 rounded-md text-sm font-medium
              transition border
              ${
                isCompared
                  ? "bg-[var(--green)] text-white border-[var(--green)]"
                  : "hover:bg-neutral-100"
              }
            `}
            title={isCompared ? "Remove from Compare" : "Add to Compare"}
          >
            {isCompared ? "✓" : "Compare"}
          </motion.button>
        </div>
      </article>
    </Link>
  );
}
