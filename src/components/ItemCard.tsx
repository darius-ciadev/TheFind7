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

    const imageSrc =
        image && image.trim() !== "" && !image.startsWith("/products/") 
            ? image 
            : "/placeholder.png";

    const href = `/${category.replace(/_/g, "-")}/${slug}`;

    return (
        <Link href={href} className="block">
            <article className="relative bg-white rounded-xl border p-5 shadow-sm transition hover:shadow-lg hover:-translate-y-1">

                {/* Rank Badge */}
                <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-[var(--green)] text-white flex items-center justify-center font-bold shadow">
                    {rank}
                </div>

                {/* Image */}
                <div className="rounded-lg overflow-hidden bg-gray-200 h-48 mb-4">
                    <Image
                        src={imageSrc}
                        alt={title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                    />
                </div>

                <h3 className="text-lg font-semibold mb-1">{title}</h3>

                <p classname="text-sm text-neutral mb-3">{subtitle}</p>

                <div className="flex justify-between text-sm mb-4">
                    <span className="flex items-center gap-1">
                        ⭐ <span>{rating}</span>
                    </span>

                    <span className="font-medium">{price}</span>
                </div>

                <div className="w-full bg-[var(--green)] text-white py-2 rounded-lg font-semibold text-center transition hover:bg-[var(--green-dark)]">
                    View Item
                </div>
            </article>
        </Link>
    );
}