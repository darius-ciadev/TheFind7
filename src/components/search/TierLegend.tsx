"use client";

import { getTierIcon } from "@/lib/tierIcons";
import { Star, Flame, BadgeDollarSign, Backpack } from "lucide-react";

export default function TierLegend({
  selectedTiers = [],
  onToggle,
}: {
  selectedTiers: string[];
  onToggle: (tier: string) => void;
}) {
  return (
    <div className="mb-6 p-4 rounded-lg border bg-white shadow-sm">
      <h4 className="font-semibold mb-3 text-sm tracking-wide text-gray-700">
        Tier Legend
      </h4>

      <div className="grid grid-cols-2 gap-4 text-sm font-medium">
        {/* S Tier */}
        <button
          onClick={() => onToggle("S")}
          className={`flex items-center gap-3 p-2 rounded-md transition
            ${
              selectedTiers.includes("S")
                ? "bg-purple-50 ring-2 ring-purple-400"
                : "hover:bg-gray-50"
            }`}
          aria-label="Tier S - Premium Pick"
        >
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-md
              bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold
              shadow-[0_0_12px_rgba(193,88,255,0.85)]"
          >
            {getTierIcon("S")}
          </span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Star size={14} className="text-purple-600" />
            <span>S — Premium Pick</span>
          </div>
        </button>

        {/* A Tier */}
        <button
          onClick={() => onToggle("A")}
          className={`flex items-center gap-3 p-2 rounded-md transition
            ${
              selectedTiers.includes("A")
                ? "bg-red-50 ring-2 ring-red-400"
                : "hover:bg-gray-50"
            }`}
          aria-label="Tier A - Best Overall"
        >
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-md
              bg-red-500 text-white text-xs font-bold
              shadow-[0_0_10px_rgba(255,60,60,0.7)]"
          >
            {getTierIcon("A")}
          </span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Flame size={14} className="text-red-500" />
            <span>A — Best Overall</span>
          </div>
        </button>

        {/* B Tier */}
        <button
          onClick={() => onToggle("B")}
          className={`flex items-center gap-3 p-2 rounded-md transition
            ${
              selectedTiers.includes("B")
                ? "bg-yellow-50 ring-2 ring-yellow-400"
                : "hover:bg-gray-50"
            }`}
          aria-label="Tier B - Best Value"
        >
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-md
              bg-yellow-400 text-black text-xs font-bold
              shadow-[0_0_8px_rgba(255,234,50,0.6)]"
          >
            {getTierIcon("B")}
          </span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <BadgeDollarSign size={14} className="text-yellow-500" />
            <span>B — Best Value</span>
          </div>
        </button>

        {/* C Tier */}
        <button
          onClick={() => onToggle("C")}
          className={`flex items-center gap-3 p-2 rounded-md transition
            ${
              selectedTiers.includes("C")
                ? "bg-gray-100 ring-2 ring-gray-400"
                : "hover:bg-gray-50"
            }`}
          aria-label="Tier C - Entry / Basic"
        >
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-md
              bg-gray-300 text-gray-900 text-xs font-bold shadow-sm"
          >
            {getTierIcon("C")}
          </span>
          <div className="flex items-center gap-1.5 text-gray-800">
            <Backpack size={14} className="text-gray-600" />
            <span>C — Entry / Basic</span>
          </div>
        </button>
      </div>
    </div>
  );
}
