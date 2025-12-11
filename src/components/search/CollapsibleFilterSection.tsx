"use client";

import React, { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** show a little "Clear" link in the header */
  canClear?: boolean;
  onClear?: () => void;
};

export function CollapsibleFilterSection({
  title,
  children,
  defaultOpen = false,
  canClear = false,
  onClear,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 rounded-xl border bg-white overflow-hidden">
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <span className="font-medium text-sm text-slate-800">{title}</span>

        <div className="flex items-center gap-3 text-xs">
          {canClear && onClear && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // don't toggle section
                onClear();
              }}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-900 underline"
            >
              Clear
            </button>
          )}

          <span className="text-slate-400 text-base leading-none">
            {open ? "−" : "+"}
          </span>
        </div>
      </button>

      {/* BODY */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="px-4 pb-4 pt-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
