"use client";

import { X } from "lucide-react";
import clsx from "clsx";

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
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border transition-all duration-150 ease-out active:scale-95",
        selected
          ? "bg-emerald-100 border-emerald-300 text-emerald-700"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100",
        sizeStyles[size],
        className
      )}
    >
      {icon && (
        <span
          className={clsx(
            "flex-shrink-0",
            selected ? "opacity-100" : "opacity-60"
          )}
        >
          {icon}
        </span>
      )}

      <span className="whitespace-nowrap">{children}</span>

      {removable && (
        <X
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
        />
      )}
    </button>
  );
}