
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen?: boolean; // If controlled externally (optional, usually we mount/unmount)
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode | ((args: { close: () => void }) => React.ReactNode);
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
    if (isClosing) return;
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

  // Support Render Props to pass the animated close function to children
  const content = typeof children === 'function' ? children({ close: handleClose }) : children;

  // Header Style Configuration
  // For standard modals (noPadding=false), we use absolute positioning to let content scroll behind.
  // For complex layout modals (noPadding=true), we use relative positioning to ensure layout stability, but still apply blur.
  const headerPositionClass = noPadding ? 'relative' : 'absolute top-0 left-0 w-full';
  
  // Content Container Style
  // If absolute header, we need padding-top on the scroll container.
  // We use h-full to fill the modal.
  const contentContainerClass = noPadding 
    ? 'flex-1 overflow-hidden flex flex-col relative' // Complex layout: Flex based
    : 'h-full overflow-y-auto custom-scrollbar pt-20 px-6 pb-6 bg-slate-50 dark:bg-slate-900'; // Standard: Scrollable with top padding for header

  const animationStyle = localStorage.getItem('animationStyle') || 'slide-up';

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[2px] transition-all duration-300 ease-out ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={modalRef}
        key={animationStyle}
        className={`
            bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden 
            outline-none border border-white/10 relative
            ${sizes[size]} 
            ${heightClass}
            ${isClosing ? 'opacity-0 scale-95 blur-sm translate-y-4 transition-all duration-300 ease-out' : ''}
            ${!isClosing ? (
                animationStyle === 'slide-up' ? 'anim-slide-up' : 
                animationStyle === 'fade' ? 'anim-fade' : 
                animationStyle === 'fly-in' ? 'anim-fly-in' : 
                animationStyle === 'zoom' ? 'anim-zoom' : 'anim-slide-up'
            ) : ''}
            ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Blur Header */}
        <div className={`
            px-6 py-4 flex justify-between items-center z-30 shrink-0
            bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
            border-b border-slate-200/60 dark:border-slate-700/60
            supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-slate-800/60
            ${headerPositionClass}
        `}>
          <div className="flex items-center gap-3 overflow-hidden">
             {icon && (
                 <div className="text-indigo-600 dark:text-indigo-400 shrink-0">
                    {icon}
                 </div>
             )}
             <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">
                {title}
             </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 ml-4 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full transition-colors text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className={contentContainerClass}>
            {content}
        </div>
      </div>
    </div>,
    document.body
  );
};
