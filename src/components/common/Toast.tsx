import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const getBorderColor = () => {
    switch (toast.type) {
      case 'error':
        return 'border-rose-500/40 bg-rose-950/90 text-rose-100';
      case 'warning':
        return 'border-amber-500/40 bg-amber-950/90 text-amber-100';
      case 'info':
        return 'border-blue-500/40 bg-slate-900/90 text-blue-100';
      case 'success':
      default:
        return 'border-emerald-500/40 bg-slate-900/90 text-emerald-100';
    }
  };

  const getIcon = () => {
    if (toast.icon) return toast.icon;
    switch (toast.type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
      default:
        return 'check_circle';
    }
  };

  return (
    <div 
      id="toast-notification"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border ${getBorderColor()} text-sm font-medium`}>
        <span className="material-symbols-outlined text-[20px] shrink-0 text-emerald-400">
          {getIcon()}
        </span>
        <div className="flex flex-col">
          <span>{toast.message}</span>
          {toast.subMessage && (
            <span className="text-xs opacity-75 font-mono">{toast.subMessage}</span>
          )}
        </div>
        <button 
          onClick={hideToast} 
          className="ml-2 p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Cerrar notificación"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
