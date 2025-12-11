import { create } from "zustand";
import { persist } from "zustand/middleware";

type CompareState = {
  items: string[];

  // For URL → store sync
  setItems: (slugs: string[]) => void;

  // Actions
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => void;
  clear: () => void;

  // UX state
  lastAdded: string | null;
  limitReached: boolean;
  resetLastAdded: () => void;
  resetLimit: () => void;
};

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAdded: null,
      limitReached: false,

      setItems: (slugs) => {
        const unique = Array.from(new Set(slugs));
        const limited = unique.slice(0, 4); // enforce max 4
        set({
          items: limited,
          lastAdded: null,
          limitReached: false,
        });
      },

      add: (slug) => {
        const { items } = get();
        if (items.includes(slug)) return;

        if (items.length >= 4) {
          set({ limitReached: true });
          return;
        }

        set({
          items: [...items, slug],
          lastAdded: slug,
          limitReached: false,
        });
      },

      remove: (slug) => {
        const { items } = get();
        set({
          items: items.filter((s) => s !== slug),
          lastAdded: null,
          limitReached: false,
        });
      },

      toggle: (slug) => {
        const { items } = get();

        if (items.includes(slug)) {
          set({
            items: items.filter((s) => s !== slug),
            lastAdded: null,
            limitReached: false,
          });
        } else {
          if (items.length >= 4) {
            set({ limitReached: true });
            return;
          }
          set({
            items: [...items, slug],
            lastAdded: slug,
            limitReached: false,
          });
        }
      },

      clear: () =>
        set({
          items: [],
          lastAdded: null,
          limitReached: false,
        }),

      resetLastAdded: () => set({ lastAdded: null }),
      resetLimit: () => set({ limitReached: false }),
    }),
    {
      name: "compare-items",
    }
  )
);