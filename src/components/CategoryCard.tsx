import Link from "next/link";

interface CategoryCardProps {
  name: string;
  slug: string;
  emoji: string;
  tagline: string;
}

export default function CategoryCard({
  name,
  slug,
  emoji,
  tagline,
}: CategoryCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="
        group block
        rounded-2xl border bg-white p-6
        shadow-sm
        transition-all duration-300
        hover:shadow-md hover:-translate-y-1
        hover:border-[var(--green)]
      "
    >
      <div className="flex items-start gap-4">
        
        {/* Emoji bubble */}
        <div
          className="
            w-14 h-14 flex items-center justify-center
            text-3xl
            rounded-xl
            bg-white/80
            border border-gray-200/60
            shadow-sm
            transition-transform duration-300
            group-hover:scale-110
          "
        >
          {emoji}
        </div>

        {/* Text content */}
        <div className="flex flex-col flex-1">
          <h3
            className="
              text-lg font-semibold text-gray-900
              tracking-tight
              group-hover:text-[var(--green)]
              transition-colors
            "
          >
            {name}
          </h3>

          <p
            className="
              text-sm text-neutral-600 mt-1.5 leading-snug
              line-clamp-2
            "
          >
            {tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}
