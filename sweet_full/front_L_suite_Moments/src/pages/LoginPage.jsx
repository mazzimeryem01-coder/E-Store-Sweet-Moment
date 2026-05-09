import React, { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { show } = useToast();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const to = location.state?.from?.pathname || '/';
    return <Navigate to={to} replace />;
  }

  const validate = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide.';
    if (!password || password.length < 8) e.password = 'Mot de passe : min. 8 caractères.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        show('Email ou mot de passe incorrect', 'error');
      } else {
        show(
          err.response?.data?.message || 'Connexion impossible: verifier que le backend tourne sur localhost:8080',
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-brand-cream/40">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[380px] bg-white rounded-2xl shadow-card border border-[#F0F0F0] p-8"
      >
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt=""
            className="h-14 w-14 mx-auto object-contain rounded-full bg-brand-bar mb-2"
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
          <h1 className="font-display text-2xl font-bold text-brand-ink">Sweet Moment</h1>
          <p className="text-sm text-brand-ink/55">Heureux de vous revoir</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-brand-ink/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#F0F0F0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
              autoComplete="email"
            />
            {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs text-brand-ink/60">Mot de passe</label>
            <div className="relative mt-1">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#F0F0F0] px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-ink/40"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Masquer' : 'Afficher'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          disabled={loading}
          onClick={submit}
          className="mt-6 w-full py-3 rounded-[25px] bg-brand-rose text-white font-semibold disabled:opacity-50"
        >
          Se connecter
        </motion.button>

        <p className="text-center text-sm mt-4 text-brand-ink/60">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-brand-rose font-semibold">
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
