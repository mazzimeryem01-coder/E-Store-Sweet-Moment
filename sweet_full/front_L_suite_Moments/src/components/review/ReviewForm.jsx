import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../common/StarRating.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as reviewService from '../../services/reviewService.js';

export default function ReviewForm({ productId, onCreated }) {
  const { isAuthenticated, user } = useAuth();
  const { show } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-brand-ink/70">
        <Link to="/login" className="text-brand-rose font-semibold underline">
          Connectez-vous
        </Link>{' '}
        pour laisser un avis.
      </p>
    );
  }

  const submit = async () => {
    const e = {};
    if (rating < 1 || rating > 5) e.rating = 'La note est obligatoire (1 à 5).';
    if (comment.trim().length < 10) e.comment = 'Minimum 10 caractères.';
    if (comment.length > 500) e.comment = 'Maximum 500 caractères.';
    setErrors(e);
    if (Object.keys(e).length) return;

    const uid = user?.id || user?._id;
    await reviewService.createReview({
      productId,
      userId: uid,
      authorName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      rating,
      comment: comment.trim(),
    });
    show('Avis publié', 'success');
    setComment('');
    setRating(0);
    if (onCreated) onCreated();
  };

  return (
    <div className="space-y-4 border border-[#F0F0F0] rounded-2xl p-6 bg-brand-cream/40">
      <h4 className="font-display text-lg font-semibold">Votre avis</h4>
      <div>
        <p className="text-sm text-brand-ink/70 mb-2">Note</p>
        <StarRating mode="interactive" value={rating} onChange={setRating} />
        {errors.rating && <p className="text-[11px] text-red-600 mt-1">{errors.rating}</p>}
      </div>
      <div>
        <label className="text-sm text-brand-ink/70">Commentaire</label>
        <textarea
          value={comment}
          onChange={(ev) => setComment(ev.target.value)}
          rows={4}
          maxLength={500}
          className="mt-1 w-full rounded-xl border border-[#F0F0F0] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose/30"
          placeholder="Partagez votre expérience…"
        />
        <div className="flex justify-between text-[11px] text-brand-ink/50 mt-1">
          <span>{errors.comment && <span className="text-red-600">{errors.comment}</span>}</span>
          <span>{comment.length}/500</span>
        </div>
      </div>
      <button
        type="button"
        onClick={submit}
        className="w-full sm:w-auto px-8 py-3 rounded-[25px] bg-brand-rose text-white font-semibold hover:scale-[1.03] transition duration-200"
      >
        Publier
      </button>
    </div>
  );
}
