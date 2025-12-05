"use client";

import { useState } from "react";

export function useWishlist() {
  const [wish, setWish] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setWish((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isWishlisted = (id: string) => !!wish[id];

  return { wish, toggle, isWishlisted };
}
