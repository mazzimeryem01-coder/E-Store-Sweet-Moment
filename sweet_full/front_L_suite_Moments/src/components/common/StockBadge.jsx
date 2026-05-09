import React from 'react';

export default function StockBadge({ stock }) {
  let label = 'En stock';
  let cls = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (stock === 0) {
    label = 'Rupture de stock';
    cls = 'bg-red-50 text-red-700 border-red-200';
  } else if (stock <= 10) {
    label = `Stock limité — ${stock} restants`;
    cls = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-[20px] text-[11px] font-semibold border ${cls}`}
    >
      {label}
    </span>
  );
}
