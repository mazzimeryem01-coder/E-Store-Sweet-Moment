import React from 'react';
import { Star } from 'lucide-react';

const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

export default function StarRating({
  value = 0,
  onChange,
  mode = 'display',
  size = 'md',
  className = '',
}) {
  const interactive = mode === 'interactive' && typeof onChange === 'function';
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-0.5 ${className}`} role="img" aria-label={`${value} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        interactive ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-0.5 rounded hover:scale-110 transition"
          >
            <Star
              className={`${s} ${
                n <= value ? 'fill-brand-rose text-brand-rose' : 'text-brand-ink/20'
              }`}
            />
          </button>
        ) : (
          <Star
            key={n}
            className={`${s} ${
              n <= value ? 'fill-brand-rose text-brand-rose' : 'text-brand-ink/20'
            }`}
          />
        )
      )}
    </div>
  );
}
