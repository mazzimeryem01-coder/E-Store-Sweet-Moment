import { api } from './axiosConfig.js';
import { isLocalSessionUserId } from '../utils/isLocalSession.js';

const lsKey = (userId) => `sweetmoment_cart_${userId}`;

function readLocal(userId) {
  try {
    const raw = localStorage.getItem(lsKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(userId, items) {
  localStorage.setItem(lsKey(userId), JSON.stringify(items));
}

export async function getCart(userId) {
  if (isLocalSessionUserId(userId)) {
    return { items: readLocal(userId) };
  }
  const { data } = await api.get(`/cart/${userId}`);
  return data;
}

export async function addItem({ userId, productId, quantity }) {
  if (isLocalSessionUserId(userId)) {
    const items = readLocal(userId);
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        id: `local-${Date.now()}`,
        productId,
        quantity,
      });
    }
    writeLocal(userId, items);
    return { items };
  }
  const { data } = await api.post('/cart/add', { userId, productId, quantity });
  return data;
}

export async function updateItem({ itemId, quantity, userId }) {
  if (isLocalSessionUserId(userId)) {
    const items = readLocal(userId).map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    );
    writeLocal(userId, items);
    return { items };
  }
  const { data } = await api.put('/cart/update', { itemId, quantity });
  return data;
}

export async function removeItem(itemId, userId) {
  if (isLocalSessionUserId(userId)) {
    const items = readLocal(userId).filter((i) => i.id !== itemId);
    writeLocal(userId, items);
    return { items };
  }
  const { data } = await api.delete(`/cart/remove/${itemId}`);
  return data;
}

export async function clearCart(userId) {
  if (isLocalSessionUserId(userId)) {
    writeLocal(userId, []);
    return { items: [] };
  }
  const { data } = await api.delete(`/cart/clear/${userId}`);
  return data;
}
