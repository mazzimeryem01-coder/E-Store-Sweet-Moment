import { api } from './axiosConfig.js';
import { PRODUCTS } from '../data/products.js';

const IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=80';

function normalizeProduct(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  const local =
    PRODUCTS.find((p) => Number(p.id) === Number(raw.id)) ||
    PRODUCTS.find((p) => p.name === raw.name) ||
    null;
  return {
    ...raw,
    // Keep storefront visuals consistent with homepage: prefer frontend local image mapping.
    image: local?.image || raw.image || IMAGE_FALLBACK,
    imageFallback: local?.imageFallback || local?.image || raw.imageFallback || raw.image || IMAGE_FALLBACK,
  };
}

function sanitizePage(page) {
  const n = parseInt(String(page ?? '1'), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function sanitizePageSize(pageSize) {
  const n = parseInt(String(pageSize ?? '8'), 10);
  return Number.isFinite(n) && n > 0 ? n : 8;
}

function filterLocal(params = {}) {
  const { category, search, sort, page, pageSize } = params;
  let list = [...PRODUCTS];
  if (category) {
    list = list.filter((p) => p.category === category);
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }
  if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'newest') list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  else list.sort((a, b) => b.popularity - a.popularity);

  const total = list.length;
  const p = sanitizePage(page);
  const size = sanitizePageSize(pageSize);
  const start = (p - 1) * size;
  const items = list.slice(start, start + size);
  return { items, total, page: p, pageSize: size };
}

function normalizeListResponse(data, params) {
  if (Array.isArray(data)) {
    return {
      items: data.map(normalizeProduct),
      total: data.length,
      page: sanitizePage(params.page),
      pageSize: sanitizePageSize(params.pageSize),
    };
  }
  if (data && Array.isArray(data.items)) {
    return {
      items: data.items.map(normalizeProduct),
      total: data.total ?? data.items.length,
      page: sanitizePage(data.page ?? params.page),
      pageSize: sanitizePageSize(data.pageSize ?? params.pageSize),
    };
  }
  if (data && Array.isArray(data.content)) {
    return {
      items: data.content.map(normalizeProduct),
      total: data.totalElements ?? data.content.length,
      page: sanitizePage(data.number != null ? data.number + 1 : params.page),
      pageSize: sanitizePageSize(data.size ?? params.pageSize),
    };
  }
  return null;
}

export async function getAllProducts(params = {}) {
  try {
    const { data } = await api.get('/products', { params });
    const normalized = normalizeListResponse(data, params);
    if (normalized) return normalized;
    return filterLocal(params);
  } catch {
    return filterLocal(params);
  }
}

export async function getProductById(id) {
  try {
    const { data } = await api.get(`/products/${id}`);
    if (data && typeof data === 'object' && data.product) return normalizeProduct(data.product);
    return normalizeProduct(data);
  } catch {
    const p = PRODUCTS.find((x) => x.id === Number(id));
    return p ? normalizeProduct(p) : null;
  }
}

export async function searchProducts(keyword) {
  return getAllProducts({ search: keyword, page: 1, pageSize: 100 });
}
