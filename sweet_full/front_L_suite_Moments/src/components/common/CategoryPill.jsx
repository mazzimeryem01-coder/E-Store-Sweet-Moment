import React from 'react';

export default function CategoryPill({ label, active, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap px-4 py-2 rounded-[25px] text-sm font-medium border transition shrink-0 ${
        active
          ? 'bg-brand-rose text-white border-brand-rose'
          : 'bg-white text-brand-ink/70 border-[#F0F0F0] hover:border-brand-rose/40'
      } ${className}`}
    >
      {label}
    </button>
  );
}
