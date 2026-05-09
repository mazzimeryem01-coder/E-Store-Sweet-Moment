import React from 'react';

export default function LoadingSpinner({ className = '' }) {
  return (
    <div
      className={`h-10 w-10 rounded-full border-2 border-brand-rose border-t-transparent animate-spin ${className}`}
      role="status"
      aria-label="Chargement"
    />
  );
}
