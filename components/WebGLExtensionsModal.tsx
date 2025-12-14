import React, { useState, useEffect } from 'react';
import { X, Search, Layers } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface WebGLExtensionsModalProps {
  extensions: string[];
  onClose: () => void;
  t: Translation['webglTool'];
}

export const WebGLExtensionsModal: React.FC<WebGLExtensionsModalProps> = ({ extensions, onClose, t }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Trigger fade in after mount
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to finish before calling actual onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const filteredExtensions = extensions.filter(ext => 
    ext.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0">
          <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Layers className="text-indigo-600 dark:text-indigo-400" />
                {t.title}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{extensions.length} {t.count}</span>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0">
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                    type="text" 
                    placeholder={t.search_placeholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                 />
             </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/30 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                 {filteredExtensions.map((ext, index) => (
                     <div 
                        key={ext} 
                        className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors select-all truncate"
                        title={ext}
                     >
                         {ext}
                     </div>
                 ))}
                 {filteredExtensions.length === 0 && (
                     <div className="col-span-full py-8 text-center text-slate-400 text-sm">
                         No extensions match "{searchTerm}"
                     </div>
                 )}
             </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex justify-end">
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