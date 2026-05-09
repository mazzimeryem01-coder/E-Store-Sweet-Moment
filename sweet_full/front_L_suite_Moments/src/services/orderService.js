import { api } from './axiosConfig.js';
import { isLocalSessionUserId } from '../utils/isLocalSession.js';

const ORDERS_KEY = 'sweetmoment_orders';

function readOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeOrders(list) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
}

export async function createOrder(userId) {
  if (isLocalSessionUserId(userId)) {
    return {
      id: `SM-${Date.now()}`,
      userId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
  }
  const { data } = await api.post('/orders', { userId });
  return data;
}

export async function getUserOrders(userId) {
  if (isLocalSessionUserId(userId)) {
    const key = String(userId);
    return readOrders().filter((o) => String(o.userId) === key);
  }
  try {
    const { data } = await api.get(`/orders/user/${userId}`);
    return data;
  } catch {
    const key = String(userId);
    return readOrders().filter((o) => String(o.userId) === key);
  }
}

export async function getOrderById(orderId) {
  try {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  } catch {
    return readOrders().find((o) => String(o.id) === String(orderId)) || null;
  }
}

export function persistLocalOrder(order) {
  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
}
