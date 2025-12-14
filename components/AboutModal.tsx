import React, { useState, useEffect } from 'react';
import { X, Sparkles, History, Monitor } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface AboutModalProps {
  onClose: () => void;
  t: Translation['aboutModal'];
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Monitor size={20} />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
             </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.desc}
            </div>

            {/* Version Badge */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.version}</span>
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                    v1.2.0
                </span>
            </div>

            {/* Changelog */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                    <History size={16} className="text-amber-500" />
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.changelog}</h3>
                </div>
                <div className="flex items-start gap-3">
                     <div className="mt-1">
                         <Sparkles size={14} className="text-indigo-500" />
                     </div>
                     <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t.latest_update}
                     </p>
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button 
                onClick={handleClose}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
                {t.close}
            </button>
        </div>

      </div>
    </div>
  );
};