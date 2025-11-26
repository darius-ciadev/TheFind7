"use client";

import { useEffect } from "react";
import Image from "next/image";
import { devPlaceholder } from "@/utils/devPlaceholder";

type CompareModalProps = {
  open: boolean;
  onClose: () => void;
  currentItem: {
    title: string;
    image?: string;
    rating?: number;
    price?: string | number;
  } | null;
};

export default function CompareModal({ open, onClose, currentItem }: CompareModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  if (!open || !currentItem) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-600 hover:text-black text-xl"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Compare Item</h2>

        {/* ITEM CARD */}
        <div className="flex items-center gap-4 border rounded-lg p-4">
          <div className="relative w-20 h-20 rounded-md bg-gray-100 overflow-hidden">
            <Image src={devPlaceholder(currentItem.image)} alt={currentItem.title} fill className="object-cover" />
          </div>

          <div>
            <h3 className="font-semibold">{currentItem.title}</h3>
            <p className="text-sm text-neutral-600 flex gap-2 items-center">
              ⭐ {currentItem.rating}
            </p>
            <p className="font-medium">{currentItem.price}</p>
          </div>
        </div>

        {/* CTA */}
        <button className="mt-6 w-full bg-[var(--green)] text-white py-2 rounded-lg font-medium hover:bg-[var(--green-dark)] transition">
          Compare With Another →
        </button>
      </div>
    </div>
  );
}