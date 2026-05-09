import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let toastBridge = {
  show: () => {},
};

export function setAxiosToastBridge(handler) {
  toastBridge = handler ?? { show: () => {} };
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('sweetmoment_auth');
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      /* ignore */
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      const url = error.config?.url || '';
      const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('sweetmoment_auth');
        localStorage.removeItem('sweetmoment_token');
        setAuthToken(null);
        if (!window.location.pathname.startsWith('/login')) {
          window.location.assign('/login');
        }
      }
    } else if (status === 403) {
      toastBridge.show('Accès refusé', 'error');
    } else if (status >= 500) {
      toastBridge.show('Erreur serveur, réessayez plus tard', 'error');
    }
    return Promise.reject(error);
  }
);
