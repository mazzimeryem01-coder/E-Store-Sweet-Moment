import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function CartSummary() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, cartTotal, checkout } = useCart();
  const shipping = cartTotal > 500 ? 0 : 30;
  const discount = 0;
  const total = cartTotal + shipping - discount;

  const onCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (items.length === 0) return;
    try {
      const order = await checkout();
      if (order) navigate('/orders');
    } catch {
      // toast is already shown by checkout()
    }
  };

  return (
    <div className="bg-white border border-[#F0F0F0] rounded-2xl shadow-card p-6 lg:sticky lg:top-28">
      <h3 className="font-display text-xl font-semibold mb-4">Récapitulatif</h3>
      <div className="space-y-2 text-sm text-brand-ink/80">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{cartTotal.toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between">
          <span>Livraison</span>
          <span>{shipping === 0 ? 'Gratuite' : `${shipping} MAD`}</span>
        </div>
        <div className="flex justify-between">
          <span>Remise</span>
          <span>{discount > 0 ? `-${discount} MAD` : '—'}</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-[#F0F0F0]">
        <span>Total TTC</span>
        <span className="text-brand-rose">{total.toFixed(2)} MAD</span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={items.length === 0}
        className="mt-6 w-full py-3 rounded-[25px] bg-brand-rose text-white font-semibold hover:scale-[1.03] transition duration-200 disabled:opacity-40 disabled:hover:scale-100"
      >
        {!isAuthenticated ? 'Se connecter pour commander' : 'Commander'}
      </button>
      <p className="text-xs text-center text-brand-ink/50 mt-3">
        Livraison en 24-48h · Paiement à la livraison
      </p>
    </div>
  );
}
