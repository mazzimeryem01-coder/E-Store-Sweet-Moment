import React from 'react';

export default function EmptyState({ icon = '🛒', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="font-display text-2xl text-brand-ink mb-2">{title}</h2>
      {description && <p className="text-brand-ink/60 max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}
