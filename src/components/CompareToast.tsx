"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CompareToastProps = {
  message: string;
  show: boolean;
  onClose: () => void;
};

export function CompareToast({ message, show, onClose }: CompareToastProps) {
  useEffect(() => {
    if (!show) return;

    const t = setTimeout(onClose, 1800);
    return () => clearTimeout(t);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.25 }}
          className="
            fixed bottom-24 left-1/2 -translate-x-1/2
            px-4 py-3 rounded-lg
            bg-black/80 text-white text-sm
            shadow-xl z-[999]
          "
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}