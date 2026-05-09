import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Minus, Plus } from 'lucide-react';
import StarRating from '../components/common/StarRating.jsx';
import StockBadge from '../components/common/StockBadge.jsx';
import ReviewCard from '../components/review/ReviewCard.jsx';
import ReviewForm from '../components/review/ReviewForm.jsx';
import * as productService from '../services/productService.js';
import * as reviewService from '../services/reviewService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { show } = useToast();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState('');
  const uid = user?.id || user?._id;

  useEffect(() => {
    (async () => {
      const p = await productService.getProductById(id);
      setProduct(p);
      setImg(p?.image || '');
      const r = await reviewService.getReviewsByProduct(id);
      setReviews(Array.isArray(r) ? r : r?.items || []);
    })();
  }, [id]);

  const reloadReviews = async () => {
    const r = await reviewService.getReviewsByProduct(id);
    setReviews(Array.isArray(r) ? r : r?.items || []);
  };

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-brand-rose border-t-transparent animate-spin" />
      </div>
    );
  }

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 4.6;

  const add = async () => {
    if (!isAuthenticated || !uid) {
      show('Connectez-vous pour ajouter au panier', 'info');
      navigate('/login');
      return;
    }
    await addToCart(uid, product.id, qty);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="text-sm text-brand-ink/60 mb-6 flex flex-wrap items-center gap-1">
        <Link to="/" className="hover:text-brand-rose">
          Accueil
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/catalog" className="hover:text-brand-rose">
          Boutique
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          to={`/catalog?category=${encodeURIComponent(product.category)}`}
          className="hover:text-brand-rose"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <img
            src={img}
            alt={product.name}
            className="w-full rounded-2xl border border-[#F0F0F0] shadow-card object-cover max-h-[480px]"
            onError={() => setImg(product.imageFallback || product.image)}
          />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">{product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <StarRating value={Math.round(avg)} />
            <span className="text-sm text-brand-ink/60">({reviews.length} avis)</span>
          </div>
          <p className="text-2xl font-bold text-brand-rose mt-4">{product.price} MAD</p>
          <div className="mt-3">
            <StockBadge stock={product.stock} />
          </div>
          <p className="text-brand-ink/70 mt-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border border-[#F0F0F0] rounded-full">
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
              onClick={add}
              disabled={product.stock === 0}
              className="flex-1 py-3 rounded-[25px] bg-brand-rose text-white font-semibold disabled:opacity-40"
            >
              Ajouter au panier
            </motion.button>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-bold mb-6">Avis clients</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {reviews.length === 0 && (
              <p className="text-sm text-brand-ink/60">Soyez le premier à donner votre avis.</p>
            )}
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
          <ReviewForm productId={product.id} onCreated={reloadReviews} />
        </div>
      </section>
    </div>
  );
}
