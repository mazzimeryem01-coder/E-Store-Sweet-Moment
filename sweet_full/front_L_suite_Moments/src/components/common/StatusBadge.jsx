import React from 'react';

const map = {
  DELIVERED: { label: 'Livrée', cls: 'bg-amber-100 text-amber-900 border-amber-200' },
  PROCESSING: { label: 'En cours', cls: 'bg-orange-50 text-orange-800 border-orange-200' },
  CANCELLED: { label: 'Annulée', cls: 'bg-red-50 text-red-700 border-red-200' },
  PENDING: { label: 'En attente', cls: 'bg-blue-50 text-blue-800 border-blue-200' },
};

export default function StatusBadge({ status }) {
  const key = status || 'PENDING';
  const cfg = map[key] || map.PENDING;
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}
