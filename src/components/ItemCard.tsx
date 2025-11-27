import { devPlaceholder } from "@/utils/devPlaceholder";
import Image from "next/image";
import Link from "next/link";
import { itemUrl } from "@/utils/urls";

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
}: ItemCardProps) {
  /** ROUTE */
  const href = itemUrl(category, slug);

  /** BADGE (Best Overall / Best Value / Premium) */
  const badgeMap: Record<number, string> = {
    1: "Best Overall",
    2: "Best Value",
    3: "Premium",
  };
  const badge = badgeMap[rank];

  // Defensive placeholder to avoid crashes
  const imgSrc = image ? devPlaceholder(image) : "/placeholder.png";

  /* --------------------------------------------------------- */
  /* 🔹 LIST MODE — Soft Neumorphic Horizontal Layout          */
  /* --------------------------------------------------------- */
  if (viewMode === "list") {
    return (
      <Link href={href} className="block group">
        <article
          className="
            relative bg-white rounded-xl border
            p-4 flex items-center gap-5
            transition-all duration-200
            hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]
            hover:-translate-y-[2px]
          "
        >
          {/* Rank badge */}
          <div
            className="
              absolute -top-3 -left-3
              w-[32px] h-[32px]
              flex items-center justify-center
              rounded-full
              bg-gradient-to-br from-green-400 to-green-600
              text-white text-xs font-bold
              ring-2 ring-white shadow-md
            "
          >
            {rank}
          </div>

          {badge && (
            <div
              className="
                absolute top-3 right-3
                px-2 py-1 rounded-md
                text-[10px] font-semibold uppercase tracking-wide
                bg-black/80 backdrop-blur-sm text-white
                shadow border border-white/10
              "
            >
              {badge}
            </div>
          )}

          {/* Image */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-100">
            <Image
              src={imgSrc}
              alt={title}
              fill
              priority={rank <= 3}
              sizes="96px"
              className="
                object-cover transition-all duration-300
                group-hover:shadow-[inset_0_0_8px_rgba(0,0,0,0.18)]
                group-hover:scale-[1.03]
              "
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold leading-tight mb-1 line-clamp-1">
              {title}
            </h3>

            <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
              {subtitle}
            </p>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-neutral-700 text-sm">
                ⭐ <span className="text-[13px]">{rating}</span>
              </div>

              <span className="font-medium text-[14px]">{price}</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  /* --------------------------------------------------------- */
  /* 🔹 GRID MODE — Soft Neumorphic Card Style                 */
  /* --------------------------------------------------------- */
  return (
    <Link href={href} className="block group">
      <article
        className="
          relative bg-white rounded-2xl border p-4
          shadow-[0_4px_12px_rgba(0,0,0,0.04)]
          transition-all duration-200
          hover:shadow-[0_6px_18px_rgba(0,0,0,0.07)]
          hover:-translate-y-[3px]
        "
      >
        {/* Rank badge */}
        <div
          className="
            absolute -top-3 -left-3
            w-[36px] h-[36px]
            flex items-center justify-center
            rounded-full
            bg-gradient-to-br from-green-400 to-green-600
            text-white text-sm font-bold
            ring-2 ring-white shadow-lg
            z-20
          "
        >
          {rank}
        </div>

        {/* Best badges */}
        {badge && (
          <div
            className="
              absolute top-3 right-3
              px-2 py-1
              rounded-md shadow-md
              text-[10px] font-semibold uppercase tracking-wide
              bg-black/80 backdrop-blur-sm text-white
              border border-white/10
              z-20
            "
          >
            {badge}
          </div>
        )}

        {/* Image */}
        <div
          className="
            relative w-full aspect-[16/10] rounded-xl
            overflow-hidden bg-neutral-100 mb-3
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]
          "
        >
          <Image
            src={imgSrc}
            alt={title}
            fill
            priority={rank <= 3}
            sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 50vw,
                   33vw"
            className="
              object-cover transition-all duration-300
              group-hover:shadow-[inset_0_0_10px_rgba(0,0,0,0.18)]
              group-hover:scale-[1.03]
            "
          />
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-tight mb-1">
          {title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-neutral-600 mb-3 line-clamp-2">
          {subtitle}
        </p>

        {/* Rating + Price */}
        <div className="flex justify-between items-center text-sm mb-4 mt-auto">
          <div className="flex items-center gap-1 text-neutral-700">
            <span aria-hidden="true">⭐</span>
            <span className="text-[13px]">{rating}</span>
          </div>
          <span className="price-main">{price}</span>
        </div>

        {/* CTA */}
        <div className="itemcard-cta-wrapper mt-1">
          <div
            className="
              w-full py-2 rounded-md text-center text-sm font-medium
              bg-[var(--green)] text-white
              transition duration-200
              group-hover:bg-[var(--green-dark)]
              group-hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)]
            "
          >
            View Item →
          </div>
        </div>
      </article>
    </Link>
  );
}
