import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const styles = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-brand-rose text-white',
};

const Icon = ({ type }) => {
  if (type === 'success') return <CheckCircle className="w-5 h-5 shrink-0" />;
  if (type === 'error') return <AlertCircle className="w-5 h-5 shrink-0" />;
  return <Info className="w-5 h-5 shrink-0" />;
};

export default function Toast({ message, type = 'info', onClose }) {
  return (
    <motion.div
      layout
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 80, opacity: 0 }}
      className={`min-w-[240px] max-w-sm rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 ${styles[type] || styles.info}`}
    >
      <Icon type={type} />
      <p className="text-sm flex-1 leading-snug">{message}</p>
      <button type="button" onClick={onClose} className="opacity-80 hover:opacity-100" aria-label="Fermer">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
