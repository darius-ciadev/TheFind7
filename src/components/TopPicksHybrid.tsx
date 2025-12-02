"use client";

import React from "react";
import ItemCard from "./ItemCard";

export default function TopPicksHybrid({
  items,
}: {
  items: any[];
}) {
  return (
    <div className="w-full">
      {/* MOBILE — HORIZONTAL SCROLL */}
      <div 
        className="
          block md:hidden
          overflow-x-auto
          snap-x snap-mandatory
          flex gap-4
          pb-2 -mx-6 px-6
        "
      >
        {items.map((item, i) => (
          <div
            key={item.slug}
            className="snap-start min-w-[78%] sm:min-w-[60%]"
          >
            <ItemCard
              rank={i + 1}
              title={item.title}
              subtitle={item.subtitle}
              image={item.image}
              price={item.price}
              rating={item.rating}
              slug={item.slug}
              category={item.category}
            />
          </div>
        ))}
      </div>

      {/* DESKTOP — GRID */}
      <div
        className="
          hidden md:grid
          grid-cols-2 lg:grid-cols-3
          gap-6
        "
      >
        {items.map((item, i) => (
          <ItemCard
            key={item.slug}
            rank={i + 1}
            title={item.title}
            subtitle={item.subtitle}
            image={item.image}
            price={item.price}
            rating={item.rating}
            slug={item.slug}
            category={item.category}
          />
        ))}
      </div>
    </div>
  );
}
