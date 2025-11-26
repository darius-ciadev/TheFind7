// src/pages/compare.tsx
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { items, Item } from "@/data/items";
import { devPlaceholder } from "@/utils/devPlaceholder";

export default function ComparePage() {
  const router = useRouter();
  const { items: queryItems } = router.query;

  const selectedSlugs = typeof queryItems === "string"
    ? queryItems.split(",")
    : [];

  const selectedItems: Item[] = items.filter((i) =>
    selectedSlugs.includes(i.slug)
  );

  // Scroll sync refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current || !headerRef.current) return;

    const body = scrollRef.current;
    const head = headerRef.current;

    const sync = () => {
      head.scrollLeft = body.scrollLeft;
    };
    body.addEventListener("scroll", sync);

    return () => body.removeEventListener("scroll", sync);
  }, []);

  if (selectedItems.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Nothing to compare.</h1>
        <Link href="/" className="text-green-600 underline">
          Go back home →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <h1 className="text-4xl font-extrabold text-center mb-12">
        Compare Items
      </h1>

      {/* TOP SECTION */}
      <div
        ref={headerRef}
        className="max-w-7xl mx-auto overflow-x-auto pb-6 border-b"
      >
        <div
          className="min-w-[900px] grid gap-12"
          style={{
            gridTemplateColumns: `repeat(${selectedItems.length}, 1fr)`
          }}
        >
          {selectedItems.map((item) => (
            <div key={item.slug} className="text-center">
              <div className="mx-auto w-56 h-40 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={devPlaceholder(item.image)}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>

              <h3 className="font-semibold mt-3">{item.title}</h3>
              <p className="text-neutral-500 text-sm">{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TABLE BODY */}
      <div
        ref={scrollRef}
        className="max-w-7xl mx-auto overflow-x-auto border-t"
      >
        <table className="min-w-[900px] w-full border-collapse text-sm">
          <tbody>
            {/* Helper: zebra row class */}
            {[
              {
                label: "Price",
                render: (i: Item) => i.price
              },
              {
                label: "Rating",
                render: (i: Item) => <>⭐ {i.rating}</>
              },
              {
                label: "Pros",
                render: () => (
                  <ul className="space-y-1 text-neutral-700">
                    <li>• Great build quality</li>
                    <li>• Strong user ratings</li>
                    <li>• Good value for money</li>
                  </ul>
                ),
                tall: true
              },
              {
                label: "Cons",
                render: () => (
                  <ul className="space-y-1 text-neutral-700">
                    <li>• Limited color options</li>
                    <li>• Availability varies</li>
                  </ul>
                ),
                tall: true
              },
              {
                label: "Availability",
                render: () => "✓"
              },
              {
                label: "Actions",
                render: (i: Item) => (
                  <Link
                    href={`/${i.category.replace(/_/g, "-")}/${i.slug}`}
                    className="inline-block px-4 py-2 rounded-lg border hover:bg-gray-50"
                  >
                    View Details →
                  </Link>
                )
              }
            ].map((row, index) => (
              <tr
                key={row.label}
                className={`
                  border-b
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  ${row.tall ? "align-top" : ""}
                `}
              >
                {/* Sticky first column */}
                <td className="sticky left-0 bg-white font-bold py-5 pr-6 w-48 shadow-md">
                  {row.label}
                </td>

                {selectedItems.map((i) => (
                  <td key={i.slug} className="py-5 text-center">
                    {row.render(i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
