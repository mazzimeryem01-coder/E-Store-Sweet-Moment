import { api } from './axiosConfig.js';
import { CATEGORIES } from '../data/products.js';

export async function getAllCategories() {
  try {
    const { data } = await api.get('/categories');
    return data;
  } catch {
    return CATEGORIES.map((name) => ({ id: name, name }));
  }
}
