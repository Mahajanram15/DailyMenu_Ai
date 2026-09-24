import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../../types';
import { clsx } from 'clsx';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type, title, message, duration = 4000 }: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
            info: <Info className="w-5 h-5 text-electric-400 shrink-0 mt-0.5" />,
          };

          const borderColors = {
            success: "border-brand-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]",
            error: "border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.15)]",
            warning: "border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)]",
            info: "border-electric-500/40 shadow-[0_0_25px_rgba(59,130,246,0.15)]",
          };

          const barColors = {
            success: "bg-brand-400",
            error: "bg-red-400",
            warning: "bg-amber-400",
            info: "bg-electric-400",
          };

          return (
            <div
              key={toast.id}
              className={clsx(
                "pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl glass-dropdown border shadow-2xl transition-all duration-300 transform animate-in slide-in-from-bottom-4 zoom-in-95",
                borderColors[toast.type]
              )}
            >
              {icons[toast.type]}
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-sm font-bold text-white tracking-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Toast Auto-progress indicator line */}
              {toast.duration && toast.duration > 0 && (
                <div 
                  className={clsx("absolute bottom-0 left-0 h-0.5 opacity-70", barColors[toast.type])}
                  style={{
                    animation: `toast-progress ${toast.duration}ms linear forwards`
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
