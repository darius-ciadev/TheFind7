"use client";

import * as Slider from "@radix-ui/react-slider";
import { motion } from "framer-motion";

export default function PriceRangeSlider({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  return (
    <Slider.Root
      min={0}
      max={9999}
      step={1}
      value={value}
      onValueChange={(v) => onChange([v[0], v[1]])}
      className="relative flex items-center w-full h-6 select-none touch-none"
    >
      {/* Track Background */}
      <Slider.Track
        className="
          relative grow rounded-full h-[4px]
          bg-gradient-to-r from-gray-200 to-gray-300
        "
      >
        {/* Filled Range */}
        <Slider.Range
          className="
            absolute h-full rounded-full
            bg-gradient-to-r from-emerald-400 to-emerald-600
          "
        />
      </Slider.Track>

      {/* Handles */}
      {value.map((_, i) => (
        <Slider.Thumb
          key={i}
          className="
            block w-5 h-5 rounded-full bg-white 
            border-2 border-emerald-500 shadow-md 
            hover:scale-110 active:scale-95 transition
          "
        />
      ))}
    </Slider.Root>
  );
}
