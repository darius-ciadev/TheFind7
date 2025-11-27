import React, { useState, useEffect } from "react";

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

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
        onBlur={() => onChange([min, max])}
        className="w-24 rounded border p-2"
      />
      <span>—</span>
      <input
        type="number"
        value={max}
        onChange={(e) => setMax(Number(e.target.value))}
        onBlur={() => onChange([min, max])}
        className="w-24 rounded border p-2"
      />
    </div>
  );
}
