import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Search,
  User,
  ShoppingCart,
  LogOut,
  Package,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

function LogoMark() {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="flex items-center gap-2">
      {!imgErr ? (
        <img
          src="/images/logo.jpeg"
          alt="Sweet Moment Logo"
          className="h-10 w-10 object-contain rounded-full"
          onError={() => setImgErr(true)}
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-brand-bar flex items-center justify-center text-brand-rose">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
            <path d="M12 3c-2 2-4 5-4 8a4 4 0 108 0c0-3-2-6-4-8z" />
            <ellipse cx="12" cy="14" rx="5" ry="2" fill="#D4668A" />
          </svg>
        </div>
      )}
      <div>
        <div className="font-display text-xl font-semibold text-brand-ink leading-tight">
          Sweet Moment
        </div>
        <div className="text-[10px] tracking-[0.25em] text-brand-ink/60 font-medium">
          PÂTISSERIE
        </div>
      </div>
    </div>
  );
}

const linkClass = ({ isActive }) =>
  `text-sm font-medium border-b-2 transition-all duration-200 pb-0.5 ${
    isActive ? 'text-brand-rose border-brand-rose' : 'text-brand-ink/80 border-transparent hover:text-brand-rose'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ddUser, setDdUser] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = user
    ? `${(user.firstName?.[0] || user.email?.[0] || '?').toUpperCase()}${(
        user.lastName?.[0] || user.email?.[1] || ''
      ).toUpperCase()}`
    : '';

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-[#F0F0F0] h-[70px] transition-shadow ${
        scrolled ? 'shadow-card' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <LogoMark />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/" className={linkClass} end>
            Accueil
          </NavLink>
          <NavLink to="/catalog" className={linkClass}>
            Boutique
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-brand-cream transition hidden sm:inline-flex"
            aria-label="Recherche"
            onClick={() => navigate('/catalog')}
          >
            <Search className="w-5 h-5 text-brand-ink" />
          </button>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="hidden sm:inline-flex p-2 rounded-full hover:bg-brand-cream transition"
              aria-label="Compte"
            >
              <User className="w-5 h-5 text-brand-ink" />
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setDdUser((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-brand-cream transition"
              >
                <span className="w-9 h-9 rounded-full bg-brand-rose text-white text-sm font-semibold flex items-center justify-center">
                  {initials}
                </span>
              </button>
              <AnimatePresence>
                {ddUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card border border-[#F0F0F0] py-2 z-50"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-brand-cream"
                      onClick={() => setDdUser(false)}
                    >
                      <UserCircle className="w-4 h-4" /> Mon profil
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-brand-cream"
                      onClick={() => setDdUser(false)}
                    >
                      <Package className="w-4 h-4" /> Mes commandes
                    </Link>
                    <button
                      type="button"
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        logout();
                        setDdUser(false);
                        navigate('/');
                      }}
                    >
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-brand-ink hover:text-brand-rose px-2"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-brand-rose text-white px-4 py-2 rounded-[25px] hover:scale-[1.03] transition duration-200"
              >
                S&apos;inscrire
              </Link>
            </div>
          )}

          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-brand-cream transition inline-flex"
            aria-label="Panier"
          >
            <ShoppingCart className="w-5 h-5 text-brand-ink" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="lg:hidden p-2 rounded-full hover:bg-brand-cream"
            onClick={() => setOpen(true)}
            aria-label="Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute right-0 top-0 h-full w-[min(100%,320px)] bg-white shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#F0F0F0]">
                <span className="font-display font-semibold">Menu</span>
                <button type="button" onClick={() => setOpen(false)} aria-label="Fermer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 flex flex-col gap-3 overflow-y-auto">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="text-lg transition-colors hover:text-brand-rose"
                >
                  Accueil
                </Link>
                <Link
                  to="/catalog"
                  onClick={() => setOpen(false)}
                  className="text-lg transition-colors hover:text-brand-rose"
                >
                  Boutique
                </Link>
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="mt-4 text-center border border-brand-rose text-brand-rose rounded-[25px] py-3 font-semibold"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="text-center bg-brand-rose text-white rounded-[25px] py-3 font-semibold"
                    >
                      S&apos;inscrire
                    </Link>
                  </>
                )}
                {isAuthenticated && (
                  <>
                    <Link to="/profile" onClick={() => setOpen(false)} className="text-lg">
                      Mon profil
                    </Link>
                    <Link to="/orders" onClick={() => setOpen(false)} className="text-lg">
                      Mes commandes
                    </Link>
                    <button
                      type="button"
                      className="text-left text-red-600 text-lg"
                      onClick={() => {
                        logout();
                        setOpen(false);
                        navigate('/');
                      }}
                    >
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}