"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { devPlaceholder } from "@/utils/devPlaceholder";
import ZoomModal from "./ZoomModal";

type Props = {
  images: string[];
  title: string;
};

export default function ProductGallery({ images, title }: Props) {
  const validImages = Array.isArray(images) && images.length > 0
    ? images
    : ["/placeholder.png"];

  const [active, setActive] = useState(validImages[0]);
  const [zoomOpen, setZoomOpen] = useState(false);

  const safeActive = devPlaceholder(active);

  return (
    <>
      {/* OUTER glossy card wrapper */}
      <div className="
        rounded-3xl p-[1px]
        bg-gradient-to-br from-neutral-100 via-white to-neutral-200
        shadow-[0_12px_32px_rgba(0,0,0,0.06)]
        overflow-hidden       /* <-- FIX FULL BLEED ISSUE */
      ">
        <div className="bg-white rounded-3xl p-5 lg:p-6 space-y-5">

          {/* MAIN IMAGE */}
          <motion.div
            key={safeActive}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22 }}
            className="
              relative w-full aspect-[16/10]
              rounded-xl overflow-hidden bg-neutral-100
            "
          >
            <Image
              src={safeActive}
              alt={title}
              fill
              className="object-cover transition-all duration-300"
              sizes="(max-width: 1024px) 100vw, 800px"
            />

            <button
              onClick={() => setZoomOpen(true)}
              className="
                absolute right-3 top-3 
                bg-white/90 backdrop-blur-sm 
                px-3 py-1.5 rounded-md text-xs shadow 
                hover:bg-white transition
              "
            >
              Zoom
            </button>
          </motion.div>

          {/* THUMBNAILS */}
          {validImages.length > 1 && (
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
              {validImages.map((img, i) => {
                const thumb = devPlaceholder(img);
                const selected = active === img;

                return (
                  <button
                    key={i}
                    onClick={() => setActive(img)}
                    className={`
                      shrink-0 relative w-20 h-16 rounded-xl overflow-hidden
                      bg-neutral-100 border transition
                      ${selected
                        ? "border-[var(--green)] ring-2 ring-[var(--green)] ring-offset-2 ring-offset-white"
                        : "border-neutral-200 hover:border-neutral-400"
                      }
                    `}
                  >
                    <Image
                      src={thumb}
                      alt={`${title} thumbnail ${i}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ZOOM MODAL */}
      <ZoomModal
        open={zoomOpen}
        src={safeActive}
        title={title}
        onClose={() => setZoomOpen(false)}
      />
    </>
  );
}
