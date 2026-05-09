import React, { useState } from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const dec = () => {
    if (item.quantity <= 1) {
      setConfirmOpen(true);
      return;
    }
    updateQuantity(item.id, item.quantity - 1);
  };

  const inc = () => {
    if (item.quantity >= item.stock) return;
    updateQuantity(item.id, item.quantity + 1);
  };

  const confirmRemove = () => {
    removeItem(item.id);
    setConfirmOpen(false);
  };

  return (
    <div className="flex gap-4 border border-[#F0F0F0] rounded-2xl p-4 bg-white shadow-card">
      <img
        src={item.productImage}
        alt=""
        className="w-24 h-24 object-cover rounded-xl bg-brand-cream shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <h3 className="font-display font-semibold text-brand-ink truncate">{item.productName}</h3>
          <button
            type="button"
            className="text-brand-ink/40 hover:text-red-600"
            aria-label="Retirer"
            onClick={() => setConfirmOpen(true)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-brand-ink/50">{item.category}</p>
        <p className="text-brand-rose font-bold mt-1">{item.unitPrice} MAD</p>

        <div className="flex items-center gap-3 mt-3">
          <button
            type="button"
            onClick={dec}
            className="w-9 h-9 rounded-full border border-[#F0F0F0] flex items-center justify-center hover:bg-brand-cream"
          >
            {item.quantity <= 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          </button>
          <span className="font-semibold w-6 text-center">{item.quantity}</span>
          <button
            type="button"
            onClick={inc}
            disabled={item.quantity >= item.stock}
            className="w-9 h-9 rounded-full border border-[#F0F0F0] flex items-center justify-center hover:bg-brand-cream disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <p className="text-brand-ink font-medium">Retirer cet article du panier ?</p>
            <div className="flex gap-3 mt-6 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded-full border border-[#F0F0F0]"
                onClick={() => setConfirmOpen(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:scale-[1.03] transition"
                onClick={confirmRemove}
              >
                Retirer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
