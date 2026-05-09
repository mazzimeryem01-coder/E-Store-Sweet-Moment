import { api } from './axiosConfig.js';
import { isLocalSessionUserId } from '../utils/isLocalSession.js';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: payload.password,
  });
  return data;
}

export async function getProfile(userId) {
  if (isLocalSessionUserId(userId)) {
    return null;
  }
  const { data } = await api.get(`/users/${userId}`);
  return data;
}

export async function updateProfile(userId, body) {
  if (isLocalSessionUserId(userId)) {
    return body;
  }
  const { data } = await api.put(`/users/${userId}`, body);
  return data;
}
