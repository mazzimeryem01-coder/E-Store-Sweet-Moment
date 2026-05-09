import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar.jsx';
import CategoryPill from '../components/common/CategoryPill.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import * as productService from '../services/productService.js';
import { CATEGORIES } from '../data/products.js';

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'popular';
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ items: [], total: 0 });

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const sortMap =
        sort === 'price_asc'
          ? 'price_asc'
          : sort === 'price_desc'
            ? 'price_desc'
            : sort === 'newest'
              ? 'newest'
              : 'popular';
      const res = await productService.getAllProducts({
        search,
        category,
        sort: sortMap,
        page,
        pageSize: 8,
      });
      if (!alive) return;
      setData({
        items: res.items || res.data || [],
        total: res.total ?? (res.items || res.data || []).length,
      });
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [search, category, sort, page]);

  const totalPages = Math.max(1, Math.ceil((data.total || 0) / 8));

  const sortLabel = useMemo(() => {
    if (sort === 'price_asc') return 'Prix ↑';
    if (sort === 'price_desc') return 'Prix ↓';
    if (sort === 'newest') return 'Nouveautés';
    return 'Popularité';
  }, [sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <SearchBar
          value={search}
          onChange={(v) => set('search', v)}
          onSubmit={() => setParams(params)}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <CategoryPill
            label="Tout"
            active={!category}
            onClick={() => set('category', '')}
          />
          {CATEGORIES.map((c) => (
            <CategoryPill
              key={c}
              label={c}
              active={category === c}
              onClick={() => set('category', c)}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-brand-ink/60">Trier :</span>
          <select
            value={sort}
            onChange={(e) => set('sort', e.target.value)}
            className="border border-[#F0F0F0] rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
          >
            <option value="popular">Popularité</option>
            <option value="price_asc">Prix ↑</option>
            <option value="price_desc">Prix ↓</option>
            <option value="newest">Nouveautés</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-brand-ink/60 mb-6">
        {data.total} produit{data.total > 1 ? 's' : ''} trouvé{data.total > 1 ? 's' : ''}
        {search ? ` pour «${search}»` : ''}
        {category ? ` dans ${category}` : ''}
        <span className="text-brand-ink/40"> · {sortLabel}</span>
      </p>

      <ProductGrid
        products={data.items}
        loading={loading}
        columnsClass="grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      />

      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            const active = p === page;
            return (
              <button
                key={p}
                type="button"
                onClick={() => set('page', String(p))}
                className={`min-w-[40px] h-10 px-3 rounded-full text-sm font-semibold border transition ${
                  active
                    ? 'bg-brand-rose text-white border-brand-rose'
                    : 'bg-white text-brand-ink border-[#F0F0F0] hover:border-brand-rose'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
