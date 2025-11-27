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
      <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-[0_6px_18px_rgba(0,0,0,0.04)] space-y-5">

        {/* Main Image */}
        <motion.div
          key={safeActive}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22 }}
          className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100"
        >
          <Image
            src={safeActive}
            alt={title}
            fill
            className="object-cover transition-all duration-300"
            sizes="(max-width: 1024px) 100vw, 800px"
          />

          {/* Zoom Button */}
          <button
            onClick={() => setZoomOpen(true)}
            className="absolute right-3 top-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs shadow hover:bg-white transition"
          >
            Zoom
          </button>
        </motion.div>

        {/* Thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {validImages.map((img, i) => {
            const thumb = devPlaceholder(img);
            const selected = active === img;

            return (
              <button
                key={i}
                onClick={() => setActive(img)}
                className={`
                  shrink-0 rounded-lg overflow-hidden border transition
                  w-20 h-14 relative
                  ${selected ? "ring-2 ring-[var(--green)]" : "border-neutral-200 hover:border-neutral-400"}
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

      </div>

      {/* Zoom Modal */}
      <ZoomModal
        open={zoomOpen}
        src={safeActive}
        title={title}
        onClose={() => setZoomOpen(false)}
      />
    </>
  );
}