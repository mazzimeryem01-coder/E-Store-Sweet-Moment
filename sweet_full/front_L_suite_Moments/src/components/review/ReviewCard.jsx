import React from 'react';
import StarRating from '../common/StarRating.jsx';

function relative(dateStr) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return 'il y a 1 jour';
  if (days < 30) return `il y a ${days} jours`;
  const months = Math.floor(days / 30);
  if (months === 1) return 'il y a 1 mois';
  return `il y a ${months} mois`;
}

export default function ReviewCard({ review }) {
  const name = review.authorName || 'Client';
  const initials = `${name[0] || '?'}${name[1] || ''}`.toUpperCase();
  return (
    <div className="border border-[#F0F0F0] rounded-2xl p-4 bg-white shadow-card">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-rose text-white flex items-center justify-center text-sm font-bold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-brand-ink">{name}</span>
            <StarRating value={review.rating} size="sm" />
            <span className="text-xs text-brand-ink/50">{relative(review.createdAt)}</span>
          </div>
          <p className="text-sm text-brand-ink/80 mt-2 whitespace-pre-wrap">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}
