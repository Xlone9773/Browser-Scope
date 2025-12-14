import React, { useState, useEffect } from 'react';
import { X, Copy, Check, FileCode } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface Base64ModalProps {
  data: string;
  onClose: () => void;
  t: Translation['base64Tool'];
}

export const Base64Modal: React.FC<Base64ModalProps> = ({ data, onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
      navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
          <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileCode className="text-indigo-600 dark:text-indigo-400" />
                {t.title}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.desc}</span>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-0 relative group">
             <textarea 
                className="w-full h-full p-6 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-600 dark:text-slate-300 resize-none outline-none border-none leading-relaxed"
                readOnly
                value={data}
             />
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex items-center gap-4">
            <div className="text-xs text-slate-400 font-mono mr-auto">
                Length: {data.length} chars
            </div>
            
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all active:scale-95 font-medium text-sm"
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : t.copy}
            </button>

            <button 
                onClick={handleClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
                {t.close}
            </button>
        </div>

      </div>
    </div>
  );
};