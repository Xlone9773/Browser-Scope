
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen?: boolean; // If controlled externally (optional, usually we mount/unmount)
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  className?: string;
  noPadding?: boolean; // If true, removes default padding from body (useful for custom layouts like Settings/Camera)
  fullHeight?: boolean; // If true, forces a fixed large height (good for tools/settings)
}

export const Modal: React.FC<ModalProps> = ({ 
  onClose, 
  title, 
  icon, 
  children, 
  size = 'md',
  className = '',
  noPadding = false,
  fullHeight = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entry animation
    const timer = requestAnimationFrame(() => {
        setIsVisible(true);
    });
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    if (modalRef.current) {
        modalRef.current.focus();
    }

    return () => {
        cancelAnimationFrame(timer);
        document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to finish
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
  };

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl',
    '3xl': 'max-w-5xl',
    '4xl': 'max-w-6xl',
    '5xl': 'max-w-7xl',
    full: 'max-w-full m-4',
  };

  const heightClass = fullHeight ? 'h-[85vh] md:h-[90vh]' : 'max-h-[85vh]';

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={modalRef}
        className={`
            bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden 
            transition-all duration-300 ease-out transform outline-none
            ${sizes[size]} 
            ${heightClass}
            ${isVisible && !isClosing ? 'opacity-100 scale-100 blur-0 translate-y-0' : 'opacity-0 scale-95 blur-sm translate-y-4'}
            ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
             {icon && (
                 <div className="text-indigo-600 dark:text-indigo-400">
                    {icon}
                 </div>
             )}
             <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">
                {title}
             </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-hidden flex flex-col relative ${noPadding ? '' : 'overflow-y-auto custom-scrollbar p-6 bg-slate-50 dark:bg-slate-900'}`}>
            {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
