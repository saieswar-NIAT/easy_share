import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'carousel' | 'success' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: ToastNotification | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in slide-in-from-top-4 duration-200">
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          toast.type === 'carousel'
            ? 'bg-amber-100 text-amber-600'
            : toast.type === 'success'
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-blue-100 text-blue-600'
        }`}>
          {toast.type === 'carousel' ? (
            <Sparkles className="w-4 h-4" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-slate-900 leading-tight">
            {toast.title}
          </h4>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
            {toast.message}
          </p>

          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                onClose();
              }}
              className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
            >
              {toast.actionLabel}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
