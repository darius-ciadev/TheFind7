import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { devPlaceholder } from "@/utils/devPlaceholder";

type Props = {
  open: boolean;
  src: string;
  title: string;
  onClose: () => void;
};

export default function ZoomModal({ open, src, title, onClose }: Props) {
  const safeSrc = devPlaceholder(src);

  // ESC key closes modal
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="zoom-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="zoom-modal"
            className="
              relative bg-white rounded-xl overflow-hidden shadow-2xl 
              w-full max-w-5xl h-[75vh]
            "
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* IMAGE */}
            <div className="relative w-full h-full bg-neutral-50">
              <Image
                src={safeSrc}
                alt={title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="
                absolute right-4 top-4 px-3 py-1.5 rounded-md text-sm
                bg-white/95 shadow hover:bg-white transition
              "
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
