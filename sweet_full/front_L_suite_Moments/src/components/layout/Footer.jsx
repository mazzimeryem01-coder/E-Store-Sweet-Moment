import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#1A1A2E] text-white border-t-[3px] border-brand-rose">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl font-semibold">Sweet Moment</div>
          <p className="text-brand-rose/90 text-sm mt-1">Pâtisserie artisanale</p>
          <p className="text-white/70 text-sm mt-4 leading-relaxed">
            Douceurs marocaines et pâtisseries fines, préparées chaque jour avec passion à
            Casablanca.
          </p>
          <div className="flex gap-3 mt-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-rose transition"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-rose transition"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg mb-4">Liens rapides</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link className="hover:text-brand-rose transition" to="/">
                Accueil
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-rose transition" to="/catalog">
                Boutique
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-brand-rose transition"
                to="/catalog?category=Gâteaux%20marocains"
              >
                Gâteaux marocains
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-brand-rose transition"
                to="/catalog?category=Pâtisseries%20françaises"
              >
                Pâtisseries françaises
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-brand-rose transition"
                to="/catalog?category=Gâteaux%20de%20fête"
              >
                Gâteaux de fête
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg mb-4">Mon compte</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <Link className="hover:text-brand-rose transition" to="/login">
                Connexion
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-rose transition" to="/register">
                Créer un compte
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-rose transition" to="/orders">
                Mes commandes
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-rose transition" to="/profile">
                Mon profil
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-rose transition" to="/cart">
                Panier
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>📍 Casablanca, Maroc</li>
            <li>📞 +212 6 12 34 56 78</li>
            <li>
              <a className="hover:text-brand-rose" href="mailto:contact@sweetmoment.ma">
                📧 contact@sweetmoment.ma
              </a>
            </li>
            <li>⏰ Lun-Sam : 8h00 – 20h00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50 px-4">
        © 2026 Sweet Moment. Tous droits réservés.
        <span className="mx-2">|</span>
        <button type="button" className="hover:text-brand-rose">
          Politique de confidentialité
        </button>
        <span className="mx-2">|</span>
        <button type="button" className="hover:text-brand-rose">
          Conditions d&apos;utilisation
        </button>
      </div>
    </footer>
  );
}
