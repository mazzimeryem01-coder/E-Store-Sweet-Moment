import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState.jsx';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Votre panier est vide"
        description="Parcourez notre catalogue pour ajouter vos gourmandises préférées."
        action={
          <Link
            to="/catalog"
            className="px-8 py-3 rounded-[25px] bg-brand-rose text-white font-semibold hover:scale-[1.03] transition inline-block"
          >
            Voir le catalogue
          </Link>
        }
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-brand-ink mb-8">Mon panier</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
