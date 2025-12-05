"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function HeartButton({
  size = 26,
  initial = false,
  onToggle,
}: {
  size?: number;
  initial?: boolean;
  onToggle?: (next: boolean) => void;
}) {
  const [liked, setLiked] = useState(initial);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    onToggle?.(next);
  };

  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle wishlist"
      className="relative"
      whileTap={{ scale: 0.85 }}
    >
      {/* Glow Burst */}
      <AnimatePresence>
        {liked && (
          <motion.span
            className="absolute inset-0 rounded-full"
            initial={{ scale: 0.4, opacity: 0.35 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(0,255,174,0.35), transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Heart Icon */}
      <motion.div
        initial={false}
        animate={{ scale: liked ? 1.18 : 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        {liked ? (
          <HeartSolid
            width={size}
            height={size}
            className="text-[var(--brand-accent)] drop-shadow-sm"
          />
        ) : (
          <HeartOutline
            width={size}
            height={size}
            className="text-neutral-400 hover:text-[var(--brand-accent)] transition"
          />
        )}
      </motion.div>
    </motion.button>
  );
}
