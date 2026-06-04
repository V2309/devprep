"use client"

import { use, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />
  };

  const bgStyles = {
    success: 'bg-white border-emerald-100 shadow-emerald-500/5',
    error: 'bg-white border-rose-100 shadow-rose-500/5',
    info: 'bg-white border-sky-100 shadow-sky-500/5'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 350 }}
        className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl border shadow-xl ${bgStyles[type]} max-w-sm`}
      >
        <div className="flex-shrink-0">{icons[type]}</div>
        <p className="text-sm font-medium text-slate-800 leading-snug">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
