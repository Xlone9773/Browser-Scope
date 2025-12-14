
import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, History, Monitor, CheckCircle2, Info } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface AboutModalProps {
  onClose: () => void;
  t: Translation['aboutModal'];
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation trigger
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Lock body scroll to prevent background interaction
    document.body.style.overflow = 'hidden';
    
    // Focus modal for accessibility
    if (modalRef.current) {
        modalRef.current.focus();
    }

    return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
    };
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
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={modalRef}
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] transition-all duration-300 ease-out transform outline-none ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing when clicking inside
        tabIndex={-1}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 relative shrink-0">
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            
            {/* Description & Version */}
            <div className="mb-8">
                <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {t.desc}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.version}</span>
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-xs font-mono font-bold">
                        v{t.updates && t.updates[0] ? t.updates[0].version : '1.2.0'}
                    </span>
                </div>
            </div>

            {/* Latest Highlight */}
            <div className="mb-8 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-indigo-500" />
                    <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100">{t.latest_update}</h3>
                </div>
                <p className="text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed opacity-90">
                    {t.updates && t.updates[0] ? t.updates[0].changes[0] : "New features available."}
                </p>
            </div>

            {/* Changelog History */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <History size={16} className="text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{t.history}</h3>
                </div>
                
                <div className="relative border-l-2 border-slate-100 dark:border-slate-700 ml-2 space-y-8 pl-6 pb-2">
                    {t.updates && t.updates.map((update, idx) => (
                        <div key={idx} className="relative">
                            {/* Dot */}
                            <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 ${idx === 0 ? 'bg-indigo-500 border-indigo-100 dark:border-indigo-900' : 'bg-slate-300 dark:bg-slate-600 border-slate-50 dark:border-slate-800'}`}></div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                                <span className={`text-sm font-bold ${idx === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>v{update.version}</span>
                                <span className="text-xs text-slate-400 font-mono">{update.date}</span>
                            </div>
                            
                            <ul className="space-y-2">
                                {update.changes.map((change, cIdx) => (
                                    <li key={cIdx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                                        {change}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700 flex justify-end shrink-0">
            <button 
                onClick={handleClose}
                className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
                {t.close}
            </button>
        </div>

      </div>
    </div>
  );
};
