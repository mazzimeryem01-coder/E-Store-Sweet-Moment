import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import * as orderService from '../services/orderService.js';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const o = await orderService.getOrderById(id);
      setOrder(o);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-brand-ink/60">Commande introuvable.</p>
        <Link to="/orders" className="text-brand-rose font-semibold mt-4 inline-block">
          Retour aux commandes
        </Link>
      </div>
    );
  }

  const items = order.items || [];
  const subtotal = items.reduce(
    (s, it) => s + Number(it.unitPrice || 0) * Number(it.quantity || 0),
    0
  );
  const shipping = subtotal > 500 ? 0 : 30;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/orders" className="text-sm text-brand-rose font-semibold hover:underline">
        ← Mes commandes
      </Link>
      <div className="mt-6 border border-[#F0F0F0] rounded-2xl p-6 bg-white shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold">Commande {order.id}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-brand-ink/55 mt-2">
          {new Date(order.createdAt).toLocaleString('fr-FR')}
        </p>

        <h2 className="font-semibold mt-8 mb-3">Articles</h2>
        <ul className="divide-y divide-[#F0F0F0] border border-[#F0F0F0] rounded-xl overflow-hidden">
          {items.map((it, idx) => (
            <li key={idx} className="flex justify-between px-4 py-3 text-sm bg-brand-cream/20">
              <span>
                {it.name || it.productName} × {it.quantity}
              </span>
              <span className="text-brand-rose font-semibold">
                {(Number(it.unitPrice || 0) * Number(it.quantity || 0)).toFixed(2)} MAD
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)} MAD</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison</span>
            <span>{shipping === 0 ? 'Gratuite' : `${shipping} MAD`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-[#F0F0F0]">
            <span>Total</span>
            <span className="text-brand-rose">
              {(Number(order.total) || subtotal + shipping).toFixed(2)} MAD
            </span>
          </div>
        </div>

        <h2 className="font-semibold mt-8 mb-2">Adresse de livraison</h2>
        <p className="text-sm text-brand-ink/70">{order.shippingAddress || '—'}</p>
      </div>
    </div>
  );
}
