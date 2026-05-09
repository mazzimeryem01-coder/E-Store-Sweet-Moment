import { api } from './axiosConfig.js';
import { isLocalSessionUserId } from '../utils/isLocalSession.js';

const LS = 'sweetmoment_reviews';

function allReviews() {
  try {
    const raw = localStorage.getItem(LS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReviews(list) {
  localStorage.setItem(LS, JSON.stringify(list));
}

export async function getReviewsByProduct(productId) {
  try {
    const { data } = await api.get(`/reviews/product/${productId}`);
    return data;
  } catch {
    return allReviews().filter((r) => r.productId === Number(productId));
  }
}

export async function createReview(body) {
  if (isLocalSessionUserId(body.userId)) {
    const list = allReviews();
    const row = {
      id: `rev-${Date.now()}`,
      ...body,
      productId: Number(body.productId),
      createdAt: new Date().toISOString(),
    };
    list.unshift(row);
    saveReviews(list);
    return row;
  }
  try {
    const { data } = await api.post('/reviews', body);
    return data;
  } catch {
    const list = allReviews();
    const row = {
      id: `rev-${Date.now()}`,
      ...body,
      productId: Number(body.productId),
      createdAt: new Date().toISOString(),
    };
    list.unshift(row);
    saveReviews(list);
    return row;
  }
}
