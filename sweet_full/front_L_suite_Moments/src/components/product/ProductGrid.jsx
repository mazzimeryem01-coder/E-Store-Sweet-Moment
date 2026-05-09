import React from 'react';
import ProductCard from './ProductCard.jsx';

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#F0F0F0] rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="h-[200px] bg-brand-cream" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-brand-cream rounded w-3/4" />
        <div className="h-4 bg-brand-cream rounded w-1/3" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  products,
  loading,
  columnsClass = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5',
}) {
  if (loading) {
    return (
      <div className={`grid gap-6 ${columnsClass}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${columnsClass}`}>
      {products.map((p, idx) => (
        <ProductCard key={p.id} product={p} aosDelay={(idx % 8) * 100} />
      ))}
    </div>
  );
}
