import React, { useState, useCallback, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ToastContext } from "../../hooks/useToast";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: React.ReactNode;
  duration?: number;
}

export interface ToastContextType {
  toasts: ToastItem[];
  show: (message: React.ReactNode, options?: { type?: ToastType; title?: string; duration?: number }) => string;
  success: (message: React.ReactNode, title?: string, duration?: number) => string;
  error: (message: React.ReactNode, title?: string, duration?: number) => string;
  warning: (message: React.ReactNode, title?: string, duration?: number) => string;
  info: (message: React.ReactNode, title?: string, duration?: number) => string;
  dismiss: (id: string) => void;
  clearAll: () => void;
}


interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { id, type, title, message, duration = 4000 } = toast;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const remainingRef = useRef<number>(duration);
  const startTimeRef = useRef<number>(Date.now());

  const handleClose = useCallback(() => {
    onClose(id);
  }, [id, onClose]);

  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      remainingRef.current -= Date.now() - startTimeRef.current;
    }
  };

  const resumeTimer = useCallback(() => {
    if (remainingRef.current <= 0) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      handleClose();
    }, remainingRef.current);
  }, [handleClose]);

  useEffect(() => {
    resumeTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resumeTimer]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />;
      case "error":
        return <AlertCircle className="text-rose-500 shrink-0" size={20} />;
      case "warning":
        return <AlertTriangle className="text-amber-500 shrink-0" size={20} />;
      default:
        return <Info className="text-indigo-500 shrink-0" size={20} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          border: "border-emerald-500/20 dark:border-emerald-500/30",
          shadow: "shadow-emerald-500/5",
          accentLine: "bg-emerald-500",
        };
      case "error":
        return {
          border: "border-rose-500/20 dark:border-rose-500/30",
          shadow: "shadow-rose-500/5",
          accentLine: "bg-rose-500",
        };
      case "warning":
        return {
          border: "border-amber-500/20 dark:border-amber-500/30",
          shadow: "shadow-amber-500/5",
          accentLine: "bg-amber-500",
        };
      default:
        return {
          border: "border-indigo-500/20 dark:border-indigo-500/30",
          shadow: "shadow-indigo-500/5",
          accentLine: "bg-indigo-500",
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      role="alert"
      className={`pointer-events-auto relative overflow-hidden flex gap-3 p-4 bg-white/95 dark:bg-slate-900/95 border ${styles.border} ${styles.shadow} rounded-xl shadow-lg backdrop-blur-md max-w-sm w-full transition-shadow duration-200 hover:shadow-xl`}
    >
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${styles.accentLine}`} />
      
      {getIcon()}

      <div className="flex-1 min-w-0 pr-4">
        {Boolean(title) && (
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0.5 tracking-tight">
            {title}
          </h4>
        )}
        <div className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          {message}
        </div>
      </div>

      <button
        onClick={handleClose}
        aria-label="Close notification"
        className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const show = useCallback(
    (message: React.ReactNode, options?: { type?: ToastType; title?: string; duration?: number }): string => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = {
        id,
        type: options?.type || "info",
        title: options?.title,
        message,
        duration: options?.duration,
      };

      setToasts((prev) => {
        // Enforce maximum 5 toasts simultaneously to prevent screen clutter
        if (prev.length >= 5) {
          return [...prev.slice(1), newToast];
        }
        return [...prev, newToast];
      });

      return id;
    },
    []
  );

  const success = useCallback(
    (message: React.ReactNode, title?: string, duration?: number): string =>
      show(message, { type: "success", title, duration }),
    [show]
  );

  const error = useCallback(
    (message: React.ReactNode, title?: string, duration?: number): string =>
      show(message, { type: "error", title, duration }),
    [show]
  );

  const warning = useCallback(
    (message: React.ReactNode, title?: string, duration?: number): string =>
      show(message, { type: "warning", title, duration }),
    [show]
  );

  const info = useCallback(
    (message: React.ReactNode, title?: string, duration?: number): string =>
      show(message, { type: "info", title, duration }),
    [show]
  );

  return (
    <ToastContext.Provider value={{ toasts, show, success, error, warning, info, dismiss, clearAll }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
