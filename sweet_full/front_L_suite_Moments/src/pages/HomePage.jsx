import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cake, Truck } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid.jsx';
import ProductVideoShowcase from '../components/home/ProductVideoShowcase.jsx';
import { PRODUCTS, INTRO_IMAGE, CATEGORIES } from '../data/products.js';

const EVENT_IMAGE =
  'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1400&q=80';

export default function HomePage() {
  const sectionRef = useRef(null);
  const popular = useMemo(
    () => [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 8),
    []
  );
  const newest = useMemo(() => {
    const tagged = PRODUCTS.filter((p) => p.isNew);
    const base = tagged.length >= 8 ? tagged : [...PRODUCTS].reverse();
    return base.slice(0, 8);
  }, []);

  const scrollProducts = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVideo = () => {
    document.getElementById('decouvrir-en-video')?.scrollIntoView({ behavior: 'smooth' });
  };

  const revealUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-brand-cream/30">
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="bg-white rounded-[20px] shadow-card border border-[#F0F0F0] overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center p-8 lg:p-12">
            <div>
              <span className="inline-block text-xs font-semibold tracking-wide text-brand-rose bg-brand-bar px-3 py-1 rounded-full mb-4">
                ❤️ FAIT AVEC AMOUR
              </span>
              <h1 className="font-display text-[40px] font-bold text-brand-ink leading-tight">
                Des pâtisseries{' '}
                <span className="text-brand-rose italic">pour chaque moment</span>
              </h1>
              <p className="text-brand-ink/65 mt-4 max-w-xl">
                Découvrez nos créations gourmandes, préparées chaque jour avec des ingrédients
                frais et de qualité.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={scrollProducts}
                  className="px-6 py-3 rounded-[25px] bg-brand-rose text-white font-semibold shadow"
                >
                  Découvrir nos produits
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={scrollToVideo}
                  className="px-6 py-3 rounded-[25px] bg-white border border-[#E0E0E0] text-brand-ink font-semibold inline-flex items-center gap-2"
                >
                  ▶ Voir la vidéo
                </motion.button>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.25 }} className="relative">
              <img
                src="/images/hero.jpeg"
                alt="Gâteau élégant"
                className="w-full max-h-[420px] object-cover rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <ProductVideoShowcase />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-[#F0F0F0] rounded-2xl shadow-card divide-x divide-[#F0F0F0]/0 md:divide-[#F0F0F0]"
        >
          {[
            { icon: '🧁', t: 'Produits frais', d: 'Préparés chaque jour' },
            { icon: '🚚', t: 'Livraison rapide', d: 'Partout au Maroc' },
            { icon: '🛡️', t: 'Paiement sécurisé', d: '100% sécurisé' },
            { icon: '🎧', t: 'Service client', d: 'À votre écoute' },
          ].map((x) => (
            <motion.div
              key={x.t}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-4 text-center md:text-left"
            >
              <div className="text-2xl mb-1">{x.icon}</div>
              <div className="font-semibold text-brand-ink text-sm">{x.t}</div>
              <div className="text-xs text-brand-ink/55">{x.d}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section ref={sectionRef} id="nos-gourmandises" className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">Nos gourmandises</h2>
          <div className="mx-auto mt-3 h-1 w-24 bg-brand-rose rounded-full" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin">
          <span className="shrink-0 whitespace-nowrap px-4 py-2 rounded-[25px] text-sm font-medium border bg-brand-rose text-white border-brand-rose">
            Tout
          </span>
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/catalog?category=${encodeURIComponent(c)}`} className="shrink-0">
              <span className="inline-flex whitespace-nowrap px-4 py-2 rounded-[25px] text-sm font-medium border bg-white text-brand-ink/70 border-[#F0F0F0] hover:border-brand-rose/40">
                {c}
              </span>
            </Link>
          ))}
        </div>
        <ProductGrid products={popular} loading={false} />
        <div className="text-center mt-10">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-brand-rose font-semibold hover:underline"
          >
            Voir tout →
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-3 bg-[#FFF0F3] text-brand-rose-dark rounded-2xl px-4 py-4 text-center text-sm md:text-base font-medium">
          <Truck className="w-6 h-6 shrink-0 hidden sm:block" />
          <span>
            🚚 Livraison gratuite pour toute commande supérieure à 500 MAD
          </span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-brand-ink">Nouveautés</h2>
          <Link
            to="/catalog?sort=newest"
            className="text-brand-rose font-semibold hover:underline text-sm"
          >
            Voir tout →
          </Link>
        </div>
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45 }}
        >
          <ProductGrid products={newest} loading={false} />
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="bg-white rounded-[24px] border border-[#fde0e6] p-4 md:p-5 shadow-card"
        >
          <div className="relative overflow-hidden rounded-2xl mb-6">
            <motion.img
              src={EVENT_IMAGE}
              alt="Grand gâteau pour événement spécial"
              className="w-full h-[240px] md:h-[360px] object-cover"
              loading="lazy"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.35 }}
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Cake className="w-14 h-14 text-brand-rose shrink-0" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-ink">
                Un événement spécial ?
              </h3>
              <p className="text-brand-ink/70 mt-2 max-w-2xl">
                Mariages, anniversaires, baby showers... Confiez-nous vos plus beaux moments. Nous
                réalisons des gâteaux marocains et des pièces de fête avec une finition soignée.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
              <Link
              to="/catalog"
              className="shrink-0 px-6 py-3 rounded-[25px] bg-brand-rose text-white font-semibold hover:scale-[1.03] transition duration-200 inline-flex items-center gap-2"
            >
              Commander maintenant →
            </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}