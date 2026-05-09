import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Toast from '../components/common/Toast.jsx';
import { setAxiosToastBridge } from '../services/axiosConfig.js';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => remove(id), 3000);
  }, [remove]);

  useEffect(() => {
    setAxiosToastBridge({ show: (msg, t) => show(msg, t || 'error') });
    return () => setAxiosToastBridge({ show: () => {} });
  }, [show]);

  const value = useMemo(() => ({ show, remove }), [show, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} onClose={() => remove(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
