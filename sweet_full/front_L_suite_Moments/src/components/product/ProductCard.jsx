import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProductCard({ product, aosDelay = 0 }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const { show } = useToast();
  const [fav, setFav] = useState(false);
  const [img, setImg] = useState(product.image);
  const [cartFlash, setCartFlash] = useState(false);
  const uid = user?.id || user?._id;

  const onAdd = async (e) => {
    e.stopPropagation();
    if (product.stock === 0) return;
    if (!isAuthenticated || !uid) {
      show('Connectez-vous pour ajouter au panier', 'info');
      navigate('/login');
      return;
    }
    setCartFlash(true);
    setTimeout(() => setCartFlash(false), 500);
    await addToCart(uid, product.id, 1);
  };

  return (
    <motion.article
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white border border-[#F0F0F0] rounded-2xl shadow-card overflow-hidden cursor-pointer relative"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative h-[200px] bg-brand-cream">
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={() => setImg(product.imageFallback || product.image)}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFav((v) => !v);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow"
          aria-label="Favoris"
        >
          <Heart
            className={`w-5 h-5 transition ${fav ? 'fill-brand-rose text-brand-rose' : 'text-brand-ink/40'}`}
          />
        </button>
      </div>

      <div className="p-4 pb-14 relative">
        <h3 className="font-display text-[14px] font-semibold text-brand-ink leading-snug">
          {product.name}
        </h3>
        <p className="text-[15px] font-bold text-brand-rose mt-1">{product.price} MAD</p>
      </div>

      <button
        type="button"
        disabled={product.stock === 0}
        onClick={onAdd}
        className={`absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center text-white shadow transition hover:scale-[1.03] duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
          cartFlash ? 'bg-emerald-500' : 'bg-brand-rose'
        }`}
        aria-label="Ajouter au panier"
      >
        <ShoppingCart className="w-5 h-5" />
      </button>
    </motion.article>
  );
}
