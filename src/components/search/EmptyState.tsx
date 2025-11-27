import React from "react";

export default function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-lg border p-8 text-center">
      <h3 className="text-lg font-semibold mb-2">No results found</h3>
      <p className="text-sm text-gray-600 mb-4">
        Try removing some filters or broaden your search.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={onReset} className="px-4 py-2 rounded border">
          Reset filters
        </button>
        <a href="/" className="px-4 py-2 rounded bg-slate-800 text-white">
          Browse categories
        </a>
      </div>
    </div>
  );
}
