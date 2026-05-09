import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as cartService from '../services/cartService.js';
import * as orderService from '../services/orderService.js';
import { PRODUCTS } from '../data/products.js';
import { useAuth } from './AuthContext.jsx';
import { useToast } from './ToastContext.jsx';
import { isLocalSessionUserId } from '../utils/isLocalSession.js';

const CartContext = createContext(null);

function userIdOf(u) {
  if (!u) return null;
  return u.id ?? u._id ?? null;
}

function enrichItem(raw) {
  const p = PRODUCTS.find((x) => x.id === Number(raw.productId));
  return {
    id: raw.id,
    productId: Number(raw.productId),
    productName: raw.productName || p?.name || 'Produit',
    unitPrice: raw.unitPrice ?? p?.price ?? 0,
    quantity: raw.quantity,
    productImage: raw.productImage || p?.image || '',
    category: raw.category || p?.category || '',
    stock: p?.stock ?? 0,
  };
}

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const { show } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCart = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await cartService.getCart(userId);
      const list = (res.items || res || []).map(enrichItem);
      setItems(list);
    } catch (e) {
      setError(e?.message || 'Erreur panier');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const uid = userIdOf(user);
    if (isAuthenticated && uid) {
      loadCart(uid);
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user, loadCart]);

  const cartTotal = useMemo(
    () => items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    [items]
  );

  const cartCount = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );

  const addToCart = useCallback(
    async (userId, productId, quantity = 1) => {
      const p = PRODUCTS.find((x) => x.id === Number(productId));
      if (!p) return;
      try {
        const res = await cartService.addItem({ userId, productId, quantity });
        const list = (res.items || []).map(enrichItem);
        setItems(list);
        show('Ajouté au panier', 'success');
      } catch (e) {
        show(e?.response?.data?.message || 'Impossible d’ajouter au panier', 'error');
      }
    },
    [show]
  );

  const updateQuantity = useCallback(
    async (itemId, newQty) => {
      const uid = userIdOf(user);
      if (!uid) return;
      const prev = [...items];
      setItems((its) =>
        its.map((i) => (i.id === itemId ? { ...i, quantity: newQty } : i))
      );
      try {
        const res = await cartService.updateItem({
          itemId,
          quantity: newQty,
          userId: uid,
        });
        setItems((res.items || []).map(enrichItem));
      } catch (e) {
        setItems(prev);
        show('Mise à jour impossible', 'error');
      }
    },
    [items, show, user]
  );

  const removeItem = useCallback(
    async (itemId) => {
      const uid = userIdOf(user);
      if (!uid) return;
      const prev = [...items];
      setItems((its) => its.filter((i) => i.id !== itemId));
      try {
        const res = await cartService.removeItem(itemId, uid);
        setItems((res.items || []).map(enrichItem));
        show('Article retiré', 'info');
      } catch (e) {
        setItems(prev);
        show('Suppression impossible', 'error');
      }
    },
    [items, show, user]
  );

  const clearCart = useCallback(async () => {
    const uid = userIdOf(user);
    if (!uid) return;
    const prev = [...items];
    setItems([]);
    try {
      const res = await cartService.clearCart(uid);
      setItems((res.items || []).map(enrichItem));
    } catch (e) {
      setItems(prev);
      show('Impossible de vider le panier', 'error');
    }
  }, [items, show, user]);

  const checkout = useCallback(async () => {
    const uid = userIdOf(user);
    if (!uid) return;
    try {
      const created = await orderService.createOrder(uid);
      const shipping = cartTotal > 500 ? 0 : 30;
      const totalTtc = cartTotal + shipping;
      const orderPayload = {
        id: created.id || `SM-${Date.now()}`,
        userId: uid,
        status: created.status || 'PROCESSING',
        createdAt: created.createdAt || new Date().toISOString(),
        items: items.map((i) => ({
          name: i.productName,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        total: totalTtc,
        shippingAddress: `${user.city || 'Casablanca'}, Maroc`,
      };
      if (isLocalSessionUserId(uid)) {
        orderService.persistLocalOrder(orderPayload);
      }
      await cartService.clearCart(uid);
      setItems([]);
      show('Commande confirmée !', 'success');
      return orderPayload;
    } catch (e) {
      show('Échec du paiement / commande', 'error');
      throw e;
    }
  }, [user, items, cartTotal, show]);

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      cartTotal,
      cartCount,
      loadCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      checkout,
    }),
    [
      items,
      loading,
      error,
      cartTotal,
      cartCount,
      loadCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      checkout,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
