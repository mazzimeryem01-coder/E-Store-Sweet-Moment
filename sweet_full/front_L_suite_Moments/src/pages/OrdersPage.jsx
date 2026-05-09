import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import * as orderService from '../services/orderService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function OrdersPage() {
  const { user } = useAuth();
  const uid = user?.id || user?._id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!uid) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const data = await orderService.getUserOrders(uid);
      const list = Array.isArray(data) ? data : data?.orders || [];
      setOrders(list);
      setLoading(false);
    })();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-brand-ink mb-8">Mes commandes</h1>
      {orders.length === 0 && (
        <p className="text-brand-ink/60">Aucune commande pour le moment.</p>
      )}
      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border border-[#F0F0F0] rounded-2xl p-5 bg-white shadow-card flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-brand-ink">Commande {o.id}</span>
                <StatusBadge status={o.status} />
              </div>
              <p className="text-sm text-brand-ink/55 mt-1">
                {new Date(o.createdAt).toLocaleString('fr-FR')}
              </p>
              <p className="text-sm text-brand-ink/70 mt-2">
                {(o.items || [])
                  .slice(0, 3)
                  .map((it) => `${it.name || it.productName} ×${it.quantity}`)
                  .join(', ')}
                {(o.items || []).length > 3 ? '…' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-brand-rose">{Number(o.total || 0).toFixed(2)} MAD</p>
              <Link
                to={`/orders/${encodeURIComponent(o.id)}`}
                className="text-sm text-brand-rose font-semibold inline-block mt-2 hover:underline"
              >
                Voir le détail →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
