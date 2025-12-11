"use client";

import { X } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";

interface FilterChipProps {
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FilterChip({
  selected = false,
  onClick,
  icon,
  children,
  removable = false,
  onRemove,
  size = "md",
  className,
}: FilterChipProps) {
  const sizeStyles = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-1.5 text-sm",
    lg: "px-5 py-2 text-base",
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border",
        "transition-all duration-150 ease-out",
        "shadow-sm",
        selected
          ? "bg-[var(--green)]/12 border-[var(--green)]/40 text-[var(--green-dark)] shadow-[0_1px_6px_rgba(0,0,0,0.10)]"
          : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400",
        sizeStyles[size],
        className
      )}
    >
      {icon && (
        <span
          className={clsx(
            "flex-shrink-0",
            selected ? "opacity-100" : "opacity-70"
          )}
        >
          {icon}
        </span>
      )}

      {/* <span className="whitespace-nowrap">{children}</span> */}

      {removable && (
        <X
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="h-4 w-4 flex-shrink-0 cursor-pointer text-neutral-500 hover:text-neutral-700"
        />
      )}
    </motion.button>
  );
}
