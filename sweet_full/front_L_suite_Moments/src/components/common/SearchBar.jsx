import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Rechercher un produit…' }) {
  return (
    <div className="w-full relative">
      <Search className="w-5 h-5 text-brand-ink/40 absolute left-4 top-1/2 -translate-y-1/2" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) onSubmit();
        }}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#F0F0F0] shadow-card focus:outline-none focus:ring-2 focus:ring-brand-rose/40 bg-white"
      />
    </div>
  );
}
