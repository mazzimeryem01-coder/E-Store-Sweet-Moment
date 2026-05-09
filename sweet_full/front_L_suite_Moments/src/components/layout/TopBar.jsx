import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-[#FFF0F3] text-xs sm:text-sm text-brand-ink/80 border-b border-[#fde0e6]">
      <div className="max-w-7xl mx-auto px-4 min-h-[36px] py-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
        <span className="truncate text-center sm:text-left">📍 Livraison à domicile partout au Maroc</span>
        <span className="truncate text-center sm:flex-1">
          🎁 Livraison gratuite dès 500 MAD
        </span>
        <div className="flex items-center justify-center sm:justify-end gap-3 shrink-0">
          <span>📞 +212 6 12 34 56 78</span>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noreferrer"
            className="p-1 rounded-full hover:bg-white/60 transition"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noreferrer"
            className="p-1 rounded-full hover:bg-white/60 transition"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
