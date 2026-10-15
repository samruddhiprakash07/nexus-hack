import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toast.type === 'error' ? AlertCircle : (toast.type === 'info' ? Info : CheckCircle2);
        const borderClass = toast.type === 'error' 
          ? 'border-rose-500/40 bg-[#1A1618]' 
          : (toast.type === 'info' ? 'border-sky-500/40 bg-[#161A22]' : 'border-purple-500/40 bg-[#1A1824]');

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in ${borderClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              toast.type === 'error' ? 'text-rose-400' : (toast.type === 'info' ? 'text-sky-400' : 'text-purple-400')
            }`} />
            <div className="flex-1 pr-2">
              {toast.title && <h4 className="text-sm font-semibold text-white leading-tight">{toast.title}</h4>}
              <p className="text-xs text-gray-300 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-white transition-colors p-0.5 rounded"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
