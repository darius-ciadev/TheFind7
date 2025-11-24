import Image from "next/image";
import Link from "next/link";

export interface ItemCardProps {
  rank: number;
  title: string;
  subtitle: string;
  image?: string;
  price?: string | number;
  rating?: number;
  slug: string;
  category: string;
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
}: ItemCardProps) {
  /** SSR-safe image fallback */
  const imageSrc = (() => {
    // No image provided at all
    if (!image || image.trim() === "") return "/placeholder.png";

    // DEV MODE — always fallback until real images exist
    if (process.env.NODE_ENV === "development") {
      return "/placeholder.png";
    }

    // Production: allow real image paths
    return image;
  })();


  /** URL: best_value → /best-value/slug */
  const href = `/${category.replace(/_/g, "-")}/${slug}`;

  return (
    <Link href={href} className="block group">
      <article
        className="
          relative
          bg-white
          rounded-xl
          border
          p-4
          shadow-sm
          flex
          flex-col
          transition-all
          duration-200
          hover:shadow-md
          hover:-translate-y-0.5
        "
      >
       {/* Rank badge — refined */}
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


        {/* Image */}
        <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-neutral-100 mb-3">
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority={rank <= 3}
            sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 50vw,
                   33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
          <span className="font-medium text-[14px]">{price}</span>
        </div>

        {/* CTA — CTA-PROTECTED */}
        <div className="itemcard-cta-wrapper mt-1">
            <div
                className="
                    w-full 
                    py-2 
                    rounded-md 
                    text-center 
                    text-sm 
                    font-medium
                    bg-[var(--green)] 
                    text-white 
                    transition 
                    duration-200 
                    group-hover:bg-[var(--green-dark)]
                    group-hover:shadow-sm
                "
                >
                View Item →
            </div>
        </div>
      </article>
    </Link>
  );
}