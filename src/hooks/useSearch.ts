import { useEffect, useState } from "react";
import { searchItems } from "@/utils/searchEngine";
import { Item } from "@/data/items";

export function useSearch(query: string) {
  const [results, setResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      const data = searchItems(query);
      setResults(data);
      setLoading(false);
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
}