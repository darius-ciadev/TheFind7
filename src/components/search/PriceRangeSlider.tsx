"use client";

import { useState, useEffect } from "react";

export default function PriceRangeSlider({
  value,
  onChange,
}: {
  value?: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [min, setMin] = useState(value?.[0] ?? 0);
  const [max, setMax] = useState(value?.[1] ?? 1000);

  useEffect(() => {
    if (value) {
      setMin(value[0]);
      setMax(value[1]);
    }
  }, [value]);

  const MIN = 0;
  const MAX = 1000;

  const handleMin = (v: number) => {
    const newMin = Math.min(v, max - 1);
    setMin(newMin);
    onChange([newMin, max]);
  };

  const handleMax = (v: number) => {
    const newMax = Math.max(v, min + 1);
    setMax(newMax);
    onChange([min, newMax]);
  };

  return (
    <div className="space-y-4">

      {/* Inputs */}
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={min}
          onChange={(e) => handleMin(Number(e.target.value))}
          className="
            w-full rounded-lg border border-slate-300 bg-white p-2 text-sm
            shadow-sm focus:ring-2 focus:ring-black focus:outline-none
          "
        />

        <span className="text-slate-400 font-medium">—</span>

        <input
          type="number"
          value={max}
          onChange={(e) => handleMax(Number(e.target.value))}
          className="
            w-full rounded-lg border border-slate-300 bg-white p-2 text-sm
            shadow-sm focus:ring-2 focus:ring-black focus:outline-none
          "
        />
      </div>

      {/* Slider */}
      <div className="relative h-3 w-full">
        
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-full rounded-full bg-slate-200" />

        {/* Active range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-black"
          style={{
            left: `${(min / MAX) * 100}%`,
            width: `${((max - min) / MAX) * 100}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={min}
          onChange={(e) => handleMin(Number(e.target.value))}
          className="range-thumb absolute inset-0 w-full appearance-none bg-transparent cursor-pointer"
        />

        {/* Max thumb */}
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={max}
          onChange={(e) => handleMax(Number(e.target.value))}
          className="range-thumb absolute inset-0 w-full appearance-none bg-transparent cursor-pointer"
        />
      </div>

      {/* CUSTOM STYLING */}
      <style jsx>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          background: black;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .range-thumb::-moz-range-thumb {
          height: 16px;
          width: 16px;
          background: black;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
