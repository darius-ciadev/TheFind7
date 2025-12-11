"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCompare } from "@/hooks/useCompare";

/**
 * ONE-WAY SYNC:
 *  URL -> STORE only.
 *
 * - If URL has ?items=slug1,slug2 it hydrates the compare store.
 * - CompareBar + ItemCard just read from the store.
 * - ComparePage is responsible for changing the URL when items change.
 */
export default function CompareSync() {
  const router = useRouter();
  const setItems = useCompare((s) => s.setItems);

  useEffect(() => {
    const q = router.query.items;
    if (!q) return;

    const slugs =
      typeof q === "string"
        ? q.split(",").filter(Boolean)
        : [];

    if (slugs.length) {
      setItems(slugs);
    }
  }, [router.query.items, setItems]);

  return null;
}